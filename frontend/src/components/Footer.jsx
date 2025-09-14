import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 mt-10">
      <div className="container mx-auto text-center">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">MiniBlog</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
