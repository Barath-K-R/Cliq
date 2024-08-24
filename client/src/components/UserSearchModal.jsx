import React, { useEffect, useState } from "react";
import { getAllOrgUser } from "../api/UserApi";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
const UserSearchModal = ({
  setUserSearchModal,
  selectedUsers,
  setselectedUsers,
  createChatSelection,
}) => {
  const [orgUsers, setOrgUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.user.authUser);
  useEffect(() => {
    const fetchOrgUsers = async () => {
      try {
        const response = await getAllOrgUser(user.organization_id);
        setOrgUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrgUsers();
  }, []);

  useEffect(() => {
    const filterUser = () => {
      setFilteredUsers(
        orgUsers?.filter((user) => {
          if (user.username.startsWith(searchTerm)) return user;
        })
      );
    };
    filterUser();
  }, [searchTerm]);

  const handleUserClick = (user) => {
    console.log(selectedUsers);
    if (selectedUsers.some((item) => item === user.id)) {
      //remove user already in selectedusers
      setselectedUsers(() => selectedUsers.filter((item) => item !== user.id));
    } else {
      //add users to selected list
      setselectedUsers((prev) => [...prev, user.id]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-55 " />
      <div className="relative bottom-4 flex flex-col w-3/6 h-[90%] bg-white rounded-lg shadow-lg ">
        <div className="flex justify-between items-center w-full h-10 p-6 bg-gray-100">
          <span className="font-semibold text-xl">{createChatSelection==='direct'?'Send a direct message':'Select users for your group'}</span>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={() => setUserSearchModal(false)}
          />
        </div>
        <div className="flex flex-col items-center pt-6 w-full gap-6">
          {/* search div */}
          <div className="flex items-center gap-2 border pl-2 w-5/6 h-10 border-b-gray-200">
            <AiOutlineSearch size={24} className="cursor-pointer" />
            <input
              type="text"
              placeholder="Search"
              className="w-full border border-gray-300 focus:border-blue-500 focus:outline-none rounded px-4 py-2"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* users list */}
          <div
            className="flex w-5/6 h-full flex-col gap-4 overflow-y-auto"
            style={{ maxHeight: "350px" }}
          >
            {filteredUsers &&
              filteredUsers?.map((user) => {
                const isSelected = selectedUsers.some(
                  (selectedUser) => selectedUser === user.id
                );

                return (
                  <div
                    key={user.id}
                    className={`flex items-center w-full h-14 ${
                      isSelected ? "bg-blue-100" : "bg-white"
                    } gap-2 pl-4 rounded-md cursor-pointer hover:bg-gray-100`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex w-10 h-10 rounded-3xl text-2xl justify-center items-center bg-gray-300">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span>{user.username}</span>
                      <span>{user.email}</span>
                    </div>
                  </div>
                );
              })}
          </div>
          {createChatSelection === "group" && (
            <button className="w-24 h-8 bg-blue-500 hover:bg-opacity-55 rounded">
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
