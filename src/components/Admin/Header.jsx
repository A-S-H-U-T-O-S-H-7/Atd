function Header() {
  return (
    <header className="flex items-center bg-green-200 ml-[60px] md:ml-[90px] justify-end px-6 py-5 border-b border-[#22c7d5]">
      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <h1 className="text-sm font-semibold text-gray-800 ">
            {"Admin"}
          </h1>
          <h1 className="text-xs text-gray-600 ">
            {"admin@example.com"}
          </h1>
        </div>

        <img
          src={"/next.svg"}
          className="w-10 h-10 border rounded-full"
        />
      </div>
    </header>
  );
}

export default Header;
