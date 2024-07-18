import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/rooms.css';

function Rooms() {
    const [roomType, setRoomType] = useState('Lecture');
    const [roomName, setRoomName] = useState('');
    const [roomTags, setRoomTags] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRoomIds, setSelectedRoomIds] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [roomIdToUpdate, setRoomIdToUpdate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const currentUser = JSON.parse(localStorage.getItem("userId"));

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/rooms/fetch');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            toast.error('Failed to fetch rooms');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const roomData = {
            roomType,
            roomName,
            roomTags,
        };

        if (isUpdating) {
            axios.put(`http://localhost:8082/api/rooms/update/${roomIdToUpdate}`, roomData)
                .then(res => {
                    //FOR ACTIVITY HISTORY
                    axios.post("http://localhost:8082/api/activity/adding",{
                        user_id : currentUser,
                        action : 'Update',
                        details : `${roomName}`,
                        type : 'room'
                    });

                    toast.success("Updated Successfully!");
                    fetchRooms();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error updating room:', err);
                    toast.error("Error in updating");
                });
        } else {
            const roomNameExists = rooms.some(room => room.room_name === roomName);
            if (roomNameExists) {
                toast.error('Room Name Already Exists!');
                return;
            }
            axios.post("http://localhost:8082/api/rooms/adding", roomData)
                .then(res => {
                    //FOR ACTIVITY HISTORY
                    axios.post("http://localhost:8082/api/activity/adding",{
                        user_id : currentUser,
                        action : 'Add',
                        details : `${roomName}`,
                        type : 'room'
                    });

                    toast.success("Added Successfully!");
                    fetchRooms();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error in Adding Room:', err);
                    toast.error("Error in Adding");
                });
        }
    };

    const handleSelectAll = () => {
        if (selectedRoomIds.length === filteredRooms.length) {
            setSelectedRoomIds([]);
        } else {
            setSelectedRoomIds(filteredRooms.map(room => room.room_id));
        }
    };

    const handleCheckboxChange = (e, roomId) => {
        if (e.target.checked) {
            setSelectedRoomIds([...selectedRoomIds, roomId]);
        } else {
            setSelectedRoomIds(selectedRoomIds.filter(id => id !== roomId));
        }
    };

    const handleDeleteSelected = () => {
        axios.delete("http://localhost:8082/api/rooms/delete", {
            data: { roomIds: selectedRoomIds }
        })
        .then(res => {
            //FOR ACTIVITY HISTORY
            const number = selectedRoomIds.length;
            axios.post("http://localhost:8082/api/activity/adding",{
                user_id : currentUser,
                action : 'Delete',
                details : `${number}`,
                type : 'room'
            });

            toast.success("Deleted Successfully!");
            fetchRooms();
            setSelectedRoomIds([]);
        })
        .catch(err => toast.error("Error Deleting Rooms"));
    };

    const handleUpdateClick = (room) => {
        setRoomType(room.room_type);
        setRoomName(room.room_name);
        setRoomTags(room.room_tags);
        setIsUpdating(true);
        setRoomIdToUpdate(room.room_id);
    };

    const resetForm = () => {
        setRoomType('');
        setRoomName('');
        setRoomTags('');
        setIsUpdating(false);
        setRoomIdToUpdate(null);
    };

    const filteredRooms = rooms.filter(room => 
        room.room_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.room_tags.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div>
                <Toaster position="bottom-right" reverseOrder={false} />
            </div>
            <Sidebar />
            <Navbar />
            <div className='rooms-container'>
                <form onSubmit={handleSubmit} className='room-form'>
                    <h2>{isUpdating ? 'Update Room' : 'Add Room'}</h2>
                    <div>
                        <label htmlFor="roomName">Room Name:</label>
                        <input 
                            type="text" 
                            name="roomName" 
                            placeholder="Room Name" 
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="roomtype">Room Type:</label>
                        <select 
                            name="roomType"
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            required
                        >
                            <option value="Lecture">Lecture</option>
                            <option value="Laboratory">Laboratory</option>
                        </select>
                    </div>
                    <div id='text-area'>
                        <label htmlFor="roomTags">Labels/Tags:</label>
                        <textarea 
                            name="roomTags" 
                            id="roomTags"
                            placeholder='Labels and Tags'
                            value={roomTags}
                            onChange={(e) => setRoomTags(e.target.value)}
                        ></textarea>
                    </div>
                    <button type='submit' id='addData'>{isUpdating ? 'UPDATE ROOM' : 'ADD ROOM'}</button>
                    {isUpdating && <button type='button' id='cancel' onClick={resetForm}>CANCEL</button>}
                </form>
                <div>
                    <div className='upper-table'>
                        <FontAwesomeIcon icon={faSearch} className='search-icon'/>
                        <input 
                            id='search'
                            type="text" 
                            placeholder='Search' 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='btns'>
                            <button id="select-all-btn" onClick={handleSelectAll}>Select All</button>
                            <button id="delete-btn" onClick={handleDeleteSelected}>Remove Room/s</button>
                        </div>
                    </div>
                    <div className='table-wrapper'>
                        <table className='rooms-table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Room Type</th>
                                    <th>Room Name</th>
                                    <th>Labels/Tags</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRooms.map((room) => (
                                    <tr key={room.room_id}>
                                        <td><input 
                                                type="checkbox" 
                                                checked={selectedRoomIds.includes(room.room_id)}
                                                onChange={(e) => handleCheckboxChange(e, room.room_id)} 
                                            />
                                        </td>
                                        <td>{room.room_type}</td>
                                        <td>{room.room_name}</td>
                                        <td>{room.room_tags}</td>
                                        <td><button id='update-btn' onClick={() => handleUpdateClick(room)}>
                                            <FontAwesomeIcon icon={faPenToSquare} className='update-icon'/>
                                        </button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rooms;
