import { useState } from "react";
import type { ChangeEvent } from "react";
import ProfileCard from "../Cards/ProfileCard";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

const Navbar = ({userInfo}: {userInfo?: any}) => { 
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
  };
  
  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-3 shadow-sm">
      <h2 className="text-xl font-semibold text-black">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      {userInfo && <ProfileCard userInfo={userInfo} handleLogout={handleLogout} />}
    </div>
  );
};

export default Navbar;