import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/sections.css';

function Sections(){

    const [sectionName, setSectionName] = useState('');
    const [sectionGroup, setSectionGroup] = useState('Group 1');
    const [yearLvl, setYearLvl] = useState('1st Year');
    const [numberOfStudents, setNumberOfStudents] = useState('');
    const [sectionTags, setSectionTags] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sectionIdToUpdate, setSectionIdToUpdate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/sections/fetch');
            setSections(response.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
            toast.error('Failed to fetch sections');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const sectionData = {
            sectionName,
            sectionGroup,
            yearLvl,
            numberOfStudents,
            sectionTags,
        };

        if (isUpdating) {
            axios.put(`http://localhost:8082/api/sections/update/${sectionIdToUpdate}`, sectionData)
                .then(res => {
                    toast.success("Updated Successfully!");
                    fetchSections();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error updating section:', err);
                    toast.error("Error in updating");
                });
        } else {
            const sectionExists = sections.some(section => section.section_name === sectionName);
            const groupExists = sections.some(section => section.section_group === sectionGroup);

            if (sectionExists) {
                if(groupExists){
                    toast.error('Section and Group No. Already Exists!');
                    return;
                }
            }

            axios.post("http://localhost:8082/api/sections/adding", sectionData)
                .then(res => {
                    toast.success("Added Successfully!");
                    fetchSections();
                    resetForm();
                })
                .catch(err => {
                    console.error('Error in Adding Section:', err);
                    toast.error("Error in Adding");
                });
        }
    };


    const handleSelectAll = () => {
        if (selectedSectionIds.length === filteredSections.length) {
            setSelectedSectionIds([]);
        } else {
            setSelectedSectionIds(filteredSections.map(section => section.section_id));
        }
    };

    const handleCheckboxChange = (e, sectionId) => {
        if (e.target.checked) {
            setSelectedSectionIds([...selectedSectionIds, sectionId]);
        } else {
            setSelectedSectionIds(selectedSectionIds.filter(id => id !== sectionId));
        }
    };

    const handleDeleteSelected = () => {
        axios.delete("http://localhost:8082/api/sections/delete", {
            data: { sectionIds: selectedSectionIds }
        })
        .then(res => {
            toast.success("Deleted Successfully!");
            fetchSections();
            setSelectedSectionIds([]);
        })
        .catch(err => toast.error("Error Deleting Sections"));
    };


    const handleUpdateClick = (section) => {
        setSectionName(section.section_name);
        setSectionGroup(section.section_group);
        setYearLvl(section.year_lvl);
        setNumberOfStudents(section.number_of_students);
        setSectionTags(section.section_tags);
        setIsUpdating(true);
        setSectionIdToUpdate(section.section_id);
    };

    const resetForm = () => {
        setSectionName('');
        setSectionGroup('');
        setYearLvl('1st Year');
        setNumberOfStudents('');
        setSectionTags('');
        setIsUpdating(false);   
        setSectionIdToUpdate(null);
    };

    const filteredSections = sections.filter(section => 
        section.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.section_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.year_lvl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.number_of_students.toString().includes(searchTerm) ||
        section.section_tags.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return(
        <div>
            <div>
                <Toaster position="bottom-right" reverseOrder={false} />
            </div>
            <Sidebar/>
            <Navbar/>
            <div className='sections-container'>
            <form onSubmit={handleSubmit} className='section-form'>
                    <h2>{isUpdating ? 'Update Section' : 'Add Section'}</h2>
                    <div>
                        <label htmlFor="sectionName">Section Name:</label>
                        <input
                            type="text"
                            name="sectionName"
                            placeholder="Section Name"
                            value={sectionName}
                            onChange={(e) => setSectionName(e.target.value)}
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
                        <select
                            name="sectionGroup"
                            value={sectionGroup}
                            onChange={(e) => setSectionGroup(e.target.value)}
                            required
                        >
                            <option value="Group 1">Group 1</option>
                            <option value="Group 2">Group 2</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="numberOfStudents">No. of Students:</label>
                        <input
                            type="number"
                            name="numberOfStudents"
                            placeholder="40"
                            value={numberOfStudents}
                            onChange={(e) => setNumberOfStudents(e.target.value)}
                            required
                        />
                    </div>
                    <div id='text-area'>
                        <label htmlFor="sectionTags">Labels/Tags:</label>
                        <textarea
                            name="sectionTags"
                            id="sectionTags"
                            placeholder='Labels and Tags'
                            value={sectionTags}
                            onChange={(e) => setSectionTags(e.target.value)}
                        ></textarea>
                    </div>
                    <button type='submit' id='addData'>{isUpdating ? 'UPDATE SECTION' : 'ADD SECTION'}</button>
                    {isUpdating && <button type='button' id='cancel' onClick={resetForm}>CANCEL</button>}
                </form>
                <div>
                    <div className='upper-table'>
                        <FontAwesomeIcon icon={faSearch} className='search-icon' />
                        <input
                            id='search'
                            type="text"
                            placeholder='Search'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='btns'>
                            <button id="select-all-btn" onClick={handleSelectAll}>Select All</button>
                            <button id="delete-btn" onClick={handleDeleteSelected}>Remove Section/s</button>
                        </div>
                    </div>
                    <div className='table-wrapper'>
                        <table className='sections-table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Section</th>
                                    <th>Group No.</th>
                                    <th>Year</th>
                                    <th>Students</th>
                                    <th>Label</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSections.map((section) => (
                                    <tr key={section.section_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedSectionIds.includes(section.section_id)}
                                                onChange={(e) => handleCheckboxChange(e, section.section_id)}
                                            />
                                        </td>
                                        <td>{section.section_name}</td>
                                        <td>{section.section_group}</td>
                                        <td>{section.year_lvl}</td>
                                        <td>{section.number_of_students}</td>
                                        <td>{section.section_tags}</td>
                                        <td>
                                            <button id='update-btn' onClick={() => handleUpdateClick(section)}>
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
    )
}

export default Sections;
