import React from 'react'
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { useState } from 'react';
import { Navbar, Row, Col, Button, Dropdown, DropdownButton, Tabs, Tab, Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCheck } from '@fortawesome/free-solid-svg-icons';
import '/src/style/student/assessment.css'

export const TeacherCodingAssessmentComponent = () => {
    const { classID, actID } = useParams(); // ✅ Get classID and actID from URL
    const navigate_class = useNavigate();
    const handleClassClick = () => {
        navigate_class(`/teacher/class/${classID}/activity/${actID}/items`);
    };

    const [items] = useState([
        { id: 1, itemNo: 'Item 1', point: '3', creator: 'John Doe', itemName: 'Item Name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { id: 2, itemNo: 'Item 2', point: '1', creator: 'Jane Doe', itemName: 'Item Name', description: 'This is the second item description.' },
        { id: 3, itemNo: 'Item 3', point: '5', creator: 'Jan Doe', itemName: 'Item Name', description: 'This is the third item description.' }
    ]);

    const [selectedLanguage, setSelectedLanguage] = useState({ name: 'Java', imgSrc: '/src/assets/java2.png' });
    const handleSelect = (language) => {
        const languages = {
        'C#': '/src/assets/c.png',
        'Java': '/src/assets/java2.png',
        'Python': '/src/assets/py.png',
        };
        setSelectedLanguage({ name: language, imgSrc: languages[language] });
    };

    const [selectedItem, setSelectedItem] = useState(null);
    const handleItemClick = (id) => {
        setSelectedItem(selectedItem === id ? null : id);
        setShowFinishAttempt(false);
    };

    const [showFinishAttempt, setShowFinishAttempt] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);

    return (
        <>
            <Navbar expand='lg' className='assessment-navbar-top'>
                <a href='#'><i className='bi bi-arrow-left-circle' onClick={handleClassClick}></i></a>
                <p>Back to previous page</p>

                <div className='assessment-navbar'>
                    <span className='ping'>20 ms</span>
                    <a href='#'><i className='bi bi-moon'></i></a>
                </div>
            </Navbar>

            <div className='container-fluid assessment-content'>
                <Row className='g-3'>
                    <Col>
                        <div className='description-item'>
                            {items.map((item) => (
                                <div key={item.id}>
                                    <div className='container item'>
                                        <h6>{item.itemNo}</h6>
                                        <p className='point'>{item.point} point/s</p>
                                    </div>

                                    {selectedItem === item.id && (
                                        <div className='container item-details'>
                                            <h5>{item.itemName}</h5>
                                            <p>Created by: {item.creator}</p>
                                            <p className='item-description'>{item.description}</p>
                                            <div className='sample-output'>Sample Output</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Col>
                    <Col xs={7} className='col-compiler'>
                        <div className='compiler-container'>
                            <div className='compiler-header'>
                                <Row>
                                    <Col sm={10} className='compiler-left-corner'>
                                        <Tabs>
                                            <Tab eventKey="code.java" title="code.java"></Tab>
                                        </Tabs>
                                    </Col>

                                    <Col sm={1} className='compiler-right-corner'>
                                        <DropdownButton className='compiler-dropdown' id='language-dropdown' size="sm" title={<><img src={selectedLanguage.imgSrc} style={{ width: '17px', marginRight: '8px' }}/>{selectedLanguage.name} </>} onSelect={handleSelect}>
                                            <Dropdown.Item eventKey="C#"><img src='/src/assets/c.png'/>C#</Dropdown.Item>
                                            <Dropdown.Item eventKey="Java"><img src='/src/assets/java2.png'/>Java</Dropdown.Item>
                                            <Dropdown.Item eventKey="Python"><img src='/src/assets/py.png'/>Python</Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                </Row>
                                <div className='compiler-header-border'></div>
                            </div>

                            <div className='compiler-bottom'>
                                <Button className='run'><FontAwesomeIcon icon={faCirclePlay} className='run-icon'/>Run Code</Button>
                                <Button className='check'><FontAwesomeIcon icon={faCheck} className='check-icon'/>Check Code</Button>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className='item-navigation'>
                            <div>
                                <p>Item Navigation <i className='bi bi-info-circle'></i></p>
                                {items.map((item) =>
                                    <Button key={item.id} className={`item-button ${selectedItem === item.id ? 'active' : ''}`} onClick={() => handleItemClick(item.id)}>{item.id}</Button>
                                )}
                            </div>
                            <div>
                                <Button className='finish' onClick={() => setShowFinishAttempt(true)}>Finish attempt...</Button>

                                <Modal show={showFinishAttempt} onHide={() => setShowFinishAttempt(false)} backdrop='static' keyboard={false} size='md' className='activity-summary' >
                                    <Modal.Body>
                                        <h3>Activity Summary</h3>
                                        {items.map ((item) => 
                                            <div key={item.id} className='item-summary' onClick={() => handleItemClick(item.id)}>
                                                <p>{item.itemName}</p>
                                                <Button><i className='bi bi-code'></i> Console</Button>
                                                <i className='bi bi-arrow-right-circle'></i>
                                            </div>
                                        )}
                                        <div className='submit-finish'>
                                            <Button onClick={() => setShowSubmit(true)}>Submit all and Finish</Button>
                                        </div>
                                    </Modal.Body>
                                </Modal>

                                <Modal show={showSubmit} onHide={() => setShowSubmit(false)} backdrop='static' keyboard={false} size='md' className='activity-score' >
                                    <Modal.Body>
                                        <Row>
                                            <Col className='col-robot'>
                                                <div className='robot'>
                                                    <img src='/src/assets/robot 1.png' />
                                                </div>
                                            </Col>

                                            <Col className='col-activity-details'>
                                                <div className='activity-details'>
                                                    <h4>Bummer...</h4>
                                                    <p>Test name</p>
                                                </div>

                                                <div className='activity-item-score'>
                                                    <p>Test Cases</p>
                                                    <p>0/3</p>
                                                </div>

                                                <div className='activity-item-score'>
                                                    <p>Score</p>
                                                    <p>0/3</p>
                                                </div>

                                                <Button onClick={handleClassClick}>Home</Button>
                                            </Col>
                                        </Row>

                                        <div className='activity-standing'>
                                            <Row className='g-0'>
                                                <Col className='activity-standing-button'>
                                                    <p>Rank</p>
                                                    <button disabled>42nd</button>
                                                </Col>
                                                <Col className='activity-standing-button'>
                                                    <p>Overall Score</p>
                                                    <button disabled>72/100</button>
                                                </Col>
                                                <Col className='activity-standing-button'>
                                                    <p>Speed</p>
                                                    <button disabled>30m</button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>

                        <div className='test-container'>
                            <div className='test-header'>Tests <i className='bi bi-info-circle'></i></div>
                            
                            {items.map((item) =>
                                <div key={item.id} className='test-case'>
                                    <Button></Button>
                                    <p>Test case {item.id}</p>
                                    <i className='bi bi-play-circle'></i>
                                </div>
                            )}
                            
                            <div className='test-footer'>
                                <p>Score: </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
