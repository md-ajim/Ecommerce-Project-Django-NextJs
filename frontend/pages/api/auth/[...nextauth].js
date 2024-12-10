import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};


const SIGN_IN_HANDLERS = {
  credentials: async (user, account) => {
    return true; // Assuming no external API is called for credentials provider
  },
  google: async (user, account, profile, email, credentials) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/oath2login/", // Fix the endpoint typo from 'oath2' to 'oauth2'
        {
          provider: "google-oauth2",
          access_token: account.access_token,
        }
      );
      account.meta = response.data; // Store the API response in account meta

      return true;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return false;
    }
  },
  facebook: async (user, account, profile, email, credentials) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/oath2login/", // Fix the endpoint typo from 'oath2' to 'oauth2'
        {
          provider: "facebook",
          access_token: account.access_token,
        }
      );
      account.meta = response.data; // Store the API response in account meta
      return account.meta;
    } catch (error) {
      console.error("Facebook Sign-In Error:", error);
      return false;
    }
  },
};

const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        remember_me: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch("http://127.0.0.1:8000/auth/login/", {
            method: "POST",
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              remember_me: credentials.remember_me,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const user = await res.json();

          const { exp, iat, user_id } = jwtDecode(user.access);

          if (!res.ok) {
            throw new Error(user.message || "Login failed");
          }

          return { ...user, exp, iat, user_id };
        } catch (error) {
          console.error("Credentials Sign-In Error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
  ],

  pages: {
    signIn: "/form/signIn", // Custom sign-in page
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;

      return SIGN_IN_HANDLERS[account.provider](
        user,
        account,
        profile,
        email,
        credentials
      );
    },

    async jwt({ token, user, account }) {
      console.log(user, 'user-jwt')
      console.log(account, 'account-jwt')
      console.log(token, 'token-jwt')
      if (account && user) {
        token.accessToken = account.meta?.access || user?.access; // Add access token to JWT token
        token.refreshToken = account.meta?.refresh || user?.refresh; // Add refresh token to JWT token
        token.id = user?.user_id || token.id; // Set user id to token (from credentials or OAuth)
      }

      return token;
    },

    async session({ session, token }) {
      
    

      if(getCurrentEpochTime() > token.exp) {

        const res = await fetch("http://127.0.0.1:8000/auth/refresh/", {
          method: "POST",
          body: JSON.stringify({
            refresh: token.refreshToken,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const newToken = await res.json();

        if (!res.ok) {
          throw new Error(newToken.message || "Refresh token failed");
        }

        session.accessToken = newToken.access;
        session.refreshToken = newToken.refresh;
       
      }


      const { exp, iat, user_id } = jwtDecode(token.accessToken);
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.expires = exp;
      session.user.iat = iat;
      session.user.user_id = user_id;

      return session;
    },
  },

  debug: true, // Enable debug mode
  strategy: "jwt",
  maxAge: 60 * 60 * 24 * 30 * 12, // Default session maxAge (12 months )
  updateAge: 24 * 60 * 60, // Update session every 24 hours

  jwt: {
    maxAge: 60 * 60 * 24 * 30 * 12, // Default JWT token expiration (12 months )
  },

  async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    else if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  },
};

export default NextAuth(authOptions);
