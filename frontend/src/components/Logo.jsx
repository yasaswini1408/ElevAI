const Logo = ({ size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="36" rx="8" fill="#0A0A0F" stroke="#B8FF3F" strokeWidth="1.5"/>

      <path
        d="M8 8 L8 28 L20 28"
        stroke="#B8FF3F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 18 L18 18"
        stroke="#B8FF3F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 8 L20 8"
        stroke="#B8FF3F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M18 8 L24 8"
        stroke="#B8FF3F"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M21 5 L25 8 L21 11"
        stroke="#B8FF3F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <circle cx="26" cy="20" r="1.5" fill="#4A90D9"/>
      <circle cx="22" cy="24" r="1.5" fill="#4A90D9"/>
      <circle cx="29" cy="25" r="1.5" fill="#4A90D9"/>
      <circle cx="25" cy="28" r="1.5" fill="#4A90D9"/>

      <line x1="26" y1="20" x2="22" y2="24" stroke="#4A90D9" strokeWidth="0.8" opacity="0.7"/>
      <line x1="26" y1="20" x2="29" y2="25" stroke="#4A90D9" strokeWidth="0.8" opacity="0.7"/>
      <line x1="22" y1="24" x2="25" y2="28" stroke="#4A90D9" strokeWidth="0.8" opacity="0.7"/>
      <line x1="29" y1="25" x2="25" y2="28" stroke="#4A90D9" strokeWidth="0.8" opacity="0.7"/>
    </svg>
  )
}

export default Logo