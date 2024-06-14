import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare , faSearch} from '@fortawesome/free-solid-svg-icons';
import '../css/instructors.css';

function Instructors() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [workType, setWorkType] = useState('regular');
    const [tags, setTags] = useState('');
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructorIds, setSelectedInstructorIds] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [instructorIdToUpdate, setInstructorIdToUpdate] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/instructors/fetch');
            setInstructors(response.data);
        } catch (error) {
            console.error('Error fetching instructors:', error);
            toast.error('Failed to fetch instructors');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the email already exists
        const emailExists = instructors.some(instructor => instructor.email === email);
        if (emailExists) {
            toast.error('Email Already Exists!');
            return;
        }


        const instructorData = {
            email,
            firstName,
            middleName,
            lastName,
            workType,
            tags,
        };

        if (isUpdating) {
            axios.put(`http://localhost:8082/api/instructors/update/${instructorIdToUpdate}`, instructorData)
                .then(res => {
                    toast.success("Updated Successfully!");
                    fetchInstructors(); // Refresh instructors list after updating
                    resetForm(); // Reset form fields
                })
                .catch(err => {
                    console.error('Error updating instructor:', err);
                    toast.error("Error in updating");
                });
        } else {
            axios.post("http://localhost:8082/api/instructors/adding", instructorData)
                .then(res => {
                    toast.success("Added Successfully!");
                    fetchInstructors(); // Refresh instructors list after adding
                    resetForm(); // Reset form fields
                })
                .catch(err => {
                    console.error('Error in Adding Instructor:', err);
                    toast.error("Error in Adding");
                });
        }
    };

    const handleSelectAll = () => {
        if (selectedInstructorIds.length === filteredInstructors.length) {
            setSelectedInstructorIds([]);
        } else {
            setSelectedInstructorIds(filteredInstructors.map(instructor => instructor.instructor_id));
        }
    };

    const handleCheckboxChange = (e, instructorId) => {
        if (e.target.checked) {
            setSelectedInstructorIds([...selectedInstructorIds, instructorId]);
        } else {
            setSelectedInstructorIds(selectedInstructorIds.filter(id => id !== instructorId));
        }
    };

    const handleDeleteSelected = () => {
        axios.delete("http://localhost:8082/api/instructors/delete", {
            data: { instructorIds: selectedInstructorIds }
        })
        .then(res => {
            toast.success("Deleted Successfully!");
            fetchInstructors(); // Refresh instructors list after deletion
            setSelectedInstructorIds([]); // Clear selected ids after deletion
        })
        .catch(err => toast.error("Error Deleting Instructors"));
    };

    const handleUpdateClick = (instructor) => {
        setEmail(instructor.email);
        setFirstName(instructor.firstname);
        setMiddleName(instructor.middlename);
        setLastName(instructor.lastname);
        setWorkType(instructor.worktype);
        setTags(instructor.tags);
        setIsUpdating(true);
        setInstructorIdToUpdate(instructor.instructor_id);
    };

    const resetForm = () => {
        setEmail('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setWorkType('regular');
        setTags('');
        setIsUpdating(false);
        setInstructorIdToUpdate(null);
    };

    // Filter instructors based on search term
    const filteredInstructors = instructors.filter(instructor => 
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.middlename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.tags.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div>
                <Toaster position="bottom-right" reverseOrder={false} />
            </div>
            <Sidebar />
            <Navbar />
            <div className='instructors-container'>
                <form onSubmit={handleSubmit} className='instructor-form'>
                    <h2>{isUpdating ? 'Update Instructor' : 'Add Instructor'}</h2>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="firstname">First Name:</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            placeholder="First Name" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="middlename">Middle Name:</label>
                        <input 
                            type="text" 
                            name="middleName" 
                            placeholder="Middle Name" 
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastname">Last Name:</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            placeholder="Last Name" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="type">Work Type:</label>
                        <select 
                            name="workType"
                            value={workType}
                            onChange={(e) => setWorkType(e.target.value)}
                        >
                            <option value="regular">Regular</option>
                            <option value="part-timer">Part Time</option>
                        </select>
                    </div>
                    <div id='text-area'>
                        <label htmlFor="tags">Labels/Tags:</label>
                        <textarea 
                            name="tags" 
                            id="tags"
                            placeholder='ex: Specialized in Mobile App Development'
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        ></textarea>
                    </div>
                    <button type='submit' id='addData'>{isUpdating ? 'UPDATE INSTRUCTOR' : 'ADD INSTRUCTOR'}</button>
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
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                        />
                        <div className='btns'>
                            <button id="select-all-btn" onClick={handleSelectAll}>Select All</button>
                            <button id="delete-btn" onClick={handleDeleteSelected}>Remove Instructor/s</button>
                        </div>
                    </div>
                    <div className='table-wrapper'>
                        <table className='instructors-table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Instructor Email</th>
                                    <th>Instructor</th>
                                    <th>Labels/Tags</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInstructors.map((instructor) => (
                                    <tr key={instructor.instructor_id}>
                                        <td><input 
                                                type="checkbox" 
                                                checked={selectedInstructorIds.includes(instructor.instructor_id)}
                                                onChange={(e) => handleCheckboxChange(e, instructor.instructor_id)} 
                                            />
                                        </td>
                                        <td>{instructor.email}</td>
                                        <td>{`${instructor.firstname} ${instructor.middlename} ${instructor.lastname}`}</td>
                                        <td>{instructor.tags}</td>
                                        <td><button id='update-btn' onClick={() => handleUpdateClick(instructor)}>
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

export default Instructors;
