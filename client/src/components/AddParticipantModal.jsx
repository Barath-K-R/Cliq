import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { addMembersToChat } from "../api/ChatApi.js";
import { getAllOrgUser } from "../api/UserApi.js";

import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddParticipantModal = ({ chat, setAddParticipantModalOpened,userPermissions }) => {
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orgUsers, setOrgUsers] = useState(null);
  const [selectedUsers, setselectedUsers] = useState([]);
  const currentUser = useSelector((state) => state.user.authUser);

  //handling user selection
  const handleUserClick = (user) => {
    if (selectedUsers.some((item) => item.id === user.id)) {
      // setselectedUsers user already in selectedUsers
      setselectedUsers((prev) => prev.filter((item) => item.id !== user.id));
    } else {
      console.log("directly adding");
      // Add user to selected list
      setselectedUsers((prev) => {
        console.log([...prev, user.id]);
        return [...prev, user];
      });
    }
  };

  //filtering user based on user selection
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

  //fetching all organization users
  useEffect(() => {
    const fetchOrgUsers = async () => {
      try {
        const response = await getAllOrgUser(currentUser.organization_id);

        setOrgUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrgUsers();
  }, []);

  //handling addparticipant
  const handleAddParticipant=async()=>{
    const addParticipantPermission=userPermissions.find(permission=>permission.Permission.name==='add participant')
    if (!addParticipantPermission) {
      toast.error("You do not have permission to add a participant!", {
        position: "top-right",
       
      });
      return;
    }
    try {
      const userIds=selectedUsers.map(user=>user.id)
      const chatMembers=await addMembersToChat(chat.chat_id,userIds)
      console.log(chatMembers)
    } catch (error) {
      
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-55 " />
      <div className="relative bottom-0 flex flex-col items-center gap-7 w-3/6 h-[94%] bg-white rounded-lg shadow-lg ">
        {/* title */}
        <div className="flex justify-between items-center w-full h-10 p-6 bg-gray-100">
          <span className="font-semibold text-xl">{chat.Chat?.name}</span>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={() => setAddParticipantModalOpened(false)}
          />
        </div>

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
          className={`flex w-5/6 h-3/6 flex-col gap-4 overflow-y-scroll`}
          style={{ maxHeight: "350px" }}
        >
          {filteredUsers &&
            filteredUsers?.map((user) => {
              const isSelected = selectedUsers.some(
                (selectedUser) => selectedUser.id === user.id
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

        <div className="flex justify-center w-full p-4 rounded-b-lg">
          <button className="w-36 h-10 bg-blue-500 hover:bg-opacity-75 rounded" onClick={handleAddParticipant}>
            Add Partcipant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddParticipantModal;
