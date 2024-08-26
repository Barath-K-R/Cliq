import React, { useEffect, useState } from "react";
import { getAllOrgUser } from "../api/UserApi";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

const CreateChannelModal = ({ setcreateChannelModal, setselectedUsers }) => {
  const user = useSelector((state) => state.user.authUser);

  const [orgUsers, setOrgUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addParticpantModal, setaddParticpantModal] = useState(false);
  //fetching all organization users
  useEffect(() => {
    const fetchOrgUsers = async () => {
      try {
        const response = await getAllOrgUser(user.organization_id);
        setOrgUsers(response.data);
        setFilteredUsers(response.data.slice(0, 1));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrgUsers();
  }, []);

  //filtering user based on user selection
  useEffect(() => {
    const filterUser = () => {
      const filtered = orgUsers?.filter((user) =>
        user.username.startsWith(searchTerm)
      );
      console.log("filtered users ");
      console.log(filtered?.slice(0, 1));
      setFilteredUsers(filtered?.slice(0, 1));
    };
    filterUser();
  }, [searchTerm]);

  return (
    <div className="fixed flex justify-end inset-0 bg-black bg-opacity-55 z-0">
      <div className="absolute w-3/6 h-full bg-white z-50 overflow-scroll">
        {/* title */}
        <div className="flex justify-between items-center w-full h-10 p-6 bg-gray-100">
          <span className="font-semibold text-xl">Create Channel</span>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={() => {
              setcreateChannelModal(false);
              setselectedUsers([]);
            }}
          />
        </div>

        <div className="flex flex-col w-12/12 h-full mx-6 gap-6">
          <p className="pt-6 text-gray-500">
            Channels are meant for enhanced collaboration across your
            organization. You can create channels for the entire organization,
            your team or across multiple teams.
          </p>
          {/* channel visibility type */}
          <div className="flex justify-evenly items-center text-gray-600 w-12/12 h-1/6 rounded-md border hover:border-blue-300 bg-gray-100">
            <div className="organization flex justify-center items-center w-[30%] h-[35%] bg-white border border-gray-300 hover:bg-blue-100 cursor-pointer">
              <span>Organization</span>
            </div>
            <div className="team flex justify-center items-center w-[30%] h-[35%] bg-white border border-gray-300 hover:bg-blue-100 cursor-pointer">
              <span>Team</span>
            </div>
            <div className="personal flex justify-center items-center w-[30%] h-[35%] bg-white border border-gray-300 hover:bg-blue-100 cursor-pointer">
              <span>Personal</span>
            </div>
          </div>
          {/* channel name */}
          <div className="flex justify-between items-center w-full h-[6%]">
            <h2 className="w-2/6 pl-4">Channel Name</h2>
            <input
              type="text"
              placeholder="Channel Name"
              className="w-4/6 h-full border border-gray-300 focus:outline-none pl-2 rounded-md"
            />
          </div>
          {/* add participants */}
          <div className="flex justify-between items-center w-full h-[6%]">
            <h2 className="w-2/6 pl-4">Add Participants</h2>
            <input
              type="text"
              placeholder="Launch the channel by adding a few members"
              className="w-4/6 h-10 border border-gray-300 focus:outline-none pl-2 rounded-md"
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setaddParticpantModal((prev) => !prev)}
            />
            {addParticpantModal && (
              <div
                className="absolute bottom-48 left-[232px] w-[62%] h-18 bg-white rounded-md z-50 p-2 shadow-xl"
                onMouseLeave={() => setaddParticpantModal((prev) => !prev)}
              >
                {console.log(filteredUsers)}
                {filteredUsers?.map((user) => {
                  return (
                    <div className="flex justify-start items-center bg-gray-100 w-full h-full rounded-sm pl-2 gap-4 cursor-pointer">
                      <div className="flex items-center justify-center text-xl bg-gray-400 w-8 h-8 rounded-[50%]">
                        {user.username.charAt(0)}
                      </div>
                      <section className="flex flex-col justify-evenly">
                        <span>{user.username}</span>
                        <span className="text-gray-500">{user.email}</span>
                      </section>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* open or closed */}
          <div className="flex justify-between items-center w-full h-[6%]">
            <h2 className="w-2/6 pl-4">Visiblilty</h2>
            <div className="section">
              <button>Open</button>
              <button>closed</button>
            </div>
          </div>
          {/* channel description */}
          <div className="flex justify-between items-center w-full h-[20%]">
            <h2 className="w-2/6 pl-4">Channel Description</h2>
            <input
              type="text"
              placeholder="Channel Description"
              className="w-4/6 h-full border border-gray-300 focus:outline-none pl-2 rounded-md"
            />
          </div>
          {/* buttons */}
          <div className="flex justify-end gap-12">
            <button
              className="w-28 h-10 bg-white rounded-3xl border border-gray-300 hover:bg-gray-200"
              onClick={() => setcreateChannelModal((prev) => !prev)}
            >
              cancel
            </button>
            <button className="w-28 h-10 bg-blue-400 rounded-3xl hover:bg-blue-500">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;
