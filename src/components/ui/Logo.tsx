'use client';

export const Logo = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Outer circle with red gradient border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-0.5">
        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center relative">

          {/* Custom SVG Icon */}
          <svg
            fill="#ff1414"
            viewBox="0 0 19.00 19.00"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            stroke="#ff1414"
            strokeWidth="0.00019"
            style={{
              display: 'block',
              margin: 'auto'
            }}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M16.417 9.579A7.917 7.917 0 1 1 8.5 1.662a7.917 7.917 0 0 1 7.917 7.917zm-3.831-2.295a.396.396 0 0 0 .182-.53 4.697 4.697 0 0 0-4.225-2.642.4.4 0 0 0-.077.008 1.526 1.526 0 0 0-1.16.55h-.001l-.005.007a1.532 1.532 0 0 0-.096.131.846.846 0 0 1-1.327-.084.396.396 0 0 0-.772.123v1.605a.396.396 0 0 0 .768.137.846.846 0 0 1 1.35-.07q.028.042.06.08a.845.845 0 0 1 .137.464v.284h2.416v-.764a.846.846 0 0 1 .846-.846.838.838 0 0 1 .388.094 3.915 3.915 0 0 1 .987 1.27.396.396 0 0 0 .356.223.389.389 0 0 0 .173-.04zm-3.088.945a.318.318 0 0 0-.317-.316H7.938a.318.318 0 0 0-.317.316v6.687a.318.318 0 0 0 .317.317h1.243a.318.318 0 0 0 .317-.317z"></path>
            </g>
          </svg>

        </div>
      </div>
    </div>
  );
};
