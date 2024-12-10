import { useState } from 'react';

export default function OtpForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if the current one has a value
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    // Handle OTP submission, e.g., make API call
    console.log('Entered OTP:', otpCode);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Enter OTP Code</h2>
        <p className="text-gray-500 text-center mb-6">We've sent a 6-digit OTP to your email. Enter it below:</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 text-center text-2xl border-2 border-gray-300 focus:border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Verify OTP
          </button>
        </form>

        
      </div>
    </div>
  );
}
