import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl">My Project</h1>
      </header>
      <main className="p-4">{children}</main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 My Project</p>
      </footer>
    </div>
  );
};

export default Layout;
