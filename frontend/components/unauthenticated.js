

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Unauthenticated() {
    const { data: session , status } = useSession();
    const router = useRouter();

    if ( status === 'unauthenticated'){
        router.push('/');
    }

    
}