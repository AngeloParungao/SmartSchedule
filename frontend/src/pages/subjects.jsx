import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import PasswordPrompt from '../assets/components/password-prompt';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/subjects.css';

function Subjects() {
    const [user, setUser] = useState([]);
    const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);

    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [yearLvl, setYearLvl] = useState('1st Year');
    const [subjectType, setSubjectType] = useState('Major');
    const [subjectUnits, setSubjectUnits] = useState('2');
    const [subjectTags, setSubjectTags] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [subjectIdToUpdate, setSubjectIdToUpdate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('userId'));

    useEffect(() => {
        axios.get("http://localhost:8082/api/auth/fetch")
            .then(res => {
                const foundUser = res.data.find(user => user.user_id === currentUser);
                if (foundUser) {
                    setUser(foundUser);
                }
            })
            .catch(err => {
                console.error('Failed to fetch users:', err);
                toast.error("Failed to fetch users");
            });
    }, []);


    useEffect(() => {
        fetchSubjects();
    }, []);


    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`http://localhost:8082/api/subjects/fetch?creator_id=${currentUser}`);
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            toast.error('Failed to fetch subjects');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const subjectData = {
            subjectCode,
            subjectName,
            yearLvl,
            subjectType,
            subjectUnits,
            subjectTags,
            currentUser
        };

        if (isUpdating) {
            axios.put(`http://localhost:8082/api/subjects/update/${subjectIdToUpdate}`, subjectData)
                .then(res => {
                    //FOR ACTIVITY HISTORY
                    axios.post("http://localhost:8082/api/activity/adding",{
                        user_id : currentUser,
                        action : 'Update',
                        details : `${subjectName}(${subjectCode})`,
                        type : 'subject'
                    });

                    toast.success("Updated Successfully!");
                    fetchSubjects();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error updating subject:', err);
                    toast.error("Error in updating");
                });
        } else {
            const nameExists = subjects.some(subject => subject.subject_name === subjectName);
            const codeExists = subjects.some(subject => subject.subject_code === subjectCode);

            if (nameExists) {
                toast.error('Subject Name Already Exists!');
                return;
            }
            if (codeExists) {
                toast.error('Subject Code Already Exists!');
                return;
            }

            axios.post("http://localhost:8082/api/subjects/adding", subjectData)
                .then(res => {
                    //FOR ACTIVITY HISTORY
                    axios.post("http://localhost:8082/api/activity/adding",{
                        user_id : currentUser,
                        action : 'Add',
                        details : `${subjectName}(${subjectCode})`,
                        type : 'subject'
                    });

                    toast.success("Added Successfully!");
                    fetchSubjects();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error in Adding Subject:', err);
                    toast.error("Error in Adding");
                });
        }
    };

    const handleSelectAll = () => {
        if (selectedSubjectIds.length === filteredSubjects.length) {
            setSelectedSubjectIds([]);
        } else {
            setSelectedSubjectIds(filteredSubjects.map(subject => subject.subject_id));
        }
    };

    const handleCheckboxChange = (e, subjectId) => {
        if (e.target.checked) {
            setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
        } else {
            setSelectedSubjectIds(selectedSubjectIds.filter(id => id !== subjectId));
        }
    };

    const handleDeleteSelected = () => {
        setIsPasswordPromptOpen(true);
    };

    const handlePasswordSubmit = (password) => {
        if (password === user.password) {
            // Proceed with deletion
            axios.delete("http://localhost:8082/api/subjects/delete", {
                data: { subjectIds: selectedSubjectIds }
            })
            .then(res => {
                //FOR ACTIVITY HISTORY
                const number = selectedSubjectIds.length;
                axios.post("http://localhost:8082/api/activity/adding",{
                    user_id : currentUser,
                    action : 'Delete',
                    details : `${number}`,
                    type : 'subject'
                });

                toast.success("Deleted Successfully!");
                fetchSubjects();
                setSelectedSubjectIds([]);
            })
            .catch(err => toast.error("Error Deleting Subjects"));
        }
        else{
            toast.error("Incorrect password");
        }
    };



    const handleUpdateClick = (subject) => {
        setSubjectCode(subject.subject_code);
        setSubjectName(subject.subject_name);
        setYearLvl(subject.year_lvl);
        setSubjectType(subject.subject_type);
        setSubjectUnits(subject.subject_units);
        setSubjectTags(subject.subject_tags);
        setIsUpdating(true);
        setSubjectIdToUpdate(subject.subject_id);
    };

    const resetForm = () => {
        setSubjectCode('');
        setSubjectName('');
        setYearLvl('1st Year');
        setSubjectType('Major');
        setSubjectUnits('2');
        setSubjectTags('');
        setIsUpdating(false);
        setSubjectIdToUpdate(null);
    };

    const filteredSubjects = subjects.filter(subject => 
        subject.subject_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.year_lvl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.subject_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.subject_units.toString().includes(searchTerm) ||
        subject.subject_tags.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div>
                <Toaster position="bottom-right" reverseOrder={false} />
            </div>
            <Sidebar />
            <Navbar />
            <div className='subjects-container'>
                <form onSubmit={handleSubmit} className='subject-form'>
                    <h2>{isUpdating ? 'Update Subject' : 'Add Subject'}</h2>
                    <div>
                        <label htmlFor="subjectName">Subject Name:</label>
                        <input
                            type="text"
                            name="subjectName"
                            placeholder="Subject Name"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subjectCode">Subject Code:</label>
                        <input
                            type="text"
                            name="subjectCode"
                            placeholder="Subject Code"
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="yearLvl">Year Level:</label>
                        <select
                            name="yearLvl"
                            value={yearLvl}
                            onChange={(e) => setYearLvl(e.target.value)}
                            required
                        >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subjectType">Subject Type:</label>
                        <select
                            name="subjectType"
                            value={subjectType}
                            onChange={(e) => setSubjectType(e.target.value)}
                            required
                        >
                            <option value="Major">Major</option>
                            <option value="Minor">Minor</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subjectUnits">Units:</label>
                        <select
                            name="subjectUnits"
                            value={subjectUnits}
                            onChange={(e) => setSubjectUnits(e.target.value)}
                            required
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div id='text-area'>
                        <label htmlFor="subjectTags">Labels/Tags:</label>
                        <textarea
                            name="subjectTags"
                            id="subjectTags"
                            placeholder='Specialization for Business Analytics'
                            value={subjectTags}
                            onChange={(e) => setSubjectTags(e.target.value)}
                        ></textarea>
                    </div>
                    <button type='submit' id='addData'>{isUpdating ? 'UPDATE SUBJECT' : 'ADD SUBJECT'}</button>
                    {isUpdating && <button type='button' id='cancel' onClick={resetForm}>CANCEL</button>}
                </form>
                <div>
                    <div className='upper-table'>
                        <FontAwesomeIcon icon={faSearch} className='search-icon' />
                        <input
                            id='search-subject'
                            type="text"
                            placeholder='Search'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='btns'>
                            <button id="select-all-btn" onClick={handleSelectAll}>Select All</button>
                            <button id="delete-btn" onClick={handleDeleteSelected}>Remove Subject/s</button>
                            <PasswordPrompt 
                                isOpen={isPasswordPromptOpen} 
                                onRequestClose={() => setIsPasswordPromptOpen(false)}
                                onSubmit={handlePasswordSubmit} 
                            />
                        </div>
                    </div>
                    <div className='table-wrapper'>
                        <table className='subjects-table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Subject</th>
                                    <th>Code</th>
                                    <th>Year</th>
                                    <th>Type</th>
                                    <th>Units</th>
                                    <th>Label</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubjects.map((subject) => (
                                    <tr key={subject.subject_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedSubjectIds.includes(subject.subject_id)}
                                                onChange={(e) => handleCheckboxChange(e, subject.subject_id)}
                                            />
                                        </td>
                                        <td>{subject.subject_name}</td>
                                        <td>{subject.subject_code}</td>
                                        <td>{subject.year_lvl}</td>
                                        <td>{subject.subject_type}</td>
                                        <td>{subject.subject_units}</td>
                                        <td>{subject.subject_tags}</td>
                                        <td>
                                            <button id='update-btn' onClick={() => handleUpdateClick(subject)}>
                                                <FontAwesomeIcon icon={faPenToSquare} className='update-icon' />
                                            </button>
                                        </td>
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

export default Subjects;
