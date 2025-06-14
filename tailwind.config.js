module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          pop: {
            "0%": { transform: "scale(0.5)", opacity: "0" },
            "100%": { transform: "scale(1)", opacity: "1" },
          },
        },
        animation: {
          pop: "pop 0.3s ease-out forwards",
        },
      },
    },
    plugins: [],
  };
  