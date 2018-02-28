// TODO: add "Create new" file in menu with popup
// TODO: create menu for account
// TODO: show errors
// TODO: add code split menu
// TODO: fix terminal shadow and add terminal label
// TODO: add welcome popup

import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import CodeMirror from 'react-codemirror'

import {
    faCamera, faSearchPlus, faColumns, faSearchMinus, faExpand,
    faExpandArrowsAlt, faPause, faCube,
    faAsterisk, faChevronLeft, faPlay, faAngleDown, faBars, faStop,
    faCode, faEye, faSync, faTimes, faFolderOpen,
    faLifeRing, faTachometerAlt, faUser,
    faHome, faBook, faUndo, faRedo, faCut,
    faCopy, faPaste, faTrash,
    faSave, faCog, faUpload, faFile, faPlus, faDownload
} from '@fortawesome/fontawesome-free-solid'

import '../node_modules/codemirror/lib/codemirror.css'
import '../node_modules/codemirror/theme/base16-dark.css'
import '../node_modules/codemirror/addon/selection/active-line'
import './styles.css'

import ObjectViewer from './Components/ObjectViewer'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewerRotate: true,
            resetRotate: false,
            ProjectBar: false,
            zoomIn: false,
            zoomOut: false,
            boundingBox: true,
            axes: true,
            code: "\n// Exabtye.io Material Developer Sample\n// Type in your XYZ code here\n\n// If there are no errors, the viewer will show your molecule design\n\n// File Format:\n\n//    <number of atoms>\n//    comment line\n//    <element> <X> <Y> <Z>\n//    <element> <X> <Y> <Z>\n//    ...\n",
            errors: false,
            sideBar: false,
            sideBarInit: false,
            sync: true
        };

        this.rotateHandler = this.rotateHandler.bind(this);
        this.resetRotateHandler = this.resetRotateHandler.bind(this);
        this.zoomInHandler = this.zoomInHandler.bind(this);
        this.zoomOutHandler = this.zoomOutHandler.bind(this);
        this.toggleBoundHandler = this.toggleBoundHandler.bind(this);
        this.toggleAxesHandler = this.toggleAxesHandler.bind(this);
        this.toggleSyncHandler = this.toggleSyncHandler.bind(this);
        this.toggleProjectBar = this.toggleProjectBar.bind(this);

        this.updateCode = this.updateCode.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
    }

    rotateHandler() {
        this.resetStates();
        this.setState({
            viewerRotate: !this.state.viewerRotate
        });
    }

    toggleBoundHandler() {
        this.resetStates();
        this.setState({
            boundingBox: !this.state.boundingBox
        });
    }

    toggleAxesHandler() {
        this.resetStates();
        this.setState({
            axes: !this.state.axes
        });
    }

    resetStates() {
        this.setState({
            resetRotate: false,
            zoomOut: false,
            zoomIn: false
        })
    }

    resetRotateHandler() {
        this.setState({
            resetRotate: true,
            viewerRotate: false
        });
    }

    zoomInHandler() {
        this.resetStates();
        this.setState({
            zoomIn: true
        });
    }

    zoomOutHandler() {
        this.resetStates();
        this.setState({
            zoomOut: true
        });
    }

    toggleSyncHandler() {
        this.setState({
            sync: !this.state.sync
        });
    }


    toggleProjectBar() {
        this.setState({
            ProjectBar: !this.state.ProjectBar
        });
    }

    toggleSideBar() {
        this.setState({
            sideBar: !this.state.sideBar
        });

        if (!this.state.sideBarInit)
            this.setState({
                sideBarInit: true
            });
    }

    updateCode(newCode) {

        let x = newCode.split('\n');

        let lineCount = 0;
        let comment = "";
        let flag = true;

        for (let a = 0; a < x.length; a++) {

            let y = x[a].replace(/ +(?= )/g, '').split(" ");

            if (a === 0) lineCount = y[0];
            if (a === 1) comment = y.join(" ");

            if ((a === 0 && y.length !== 1) || (a > 1 && y.length !== 4 ) || (a > 1 && y.indexOf("") > -1)) {
                console.log("Syntax Error on line " + (a + 1));
                flag = false;
            }

            if (a > 1 && y.length === 4 && (isNaN(y[1]) || isNaN(y[2]) || isNaN(y[3]))) {
                console.log("Number Error on line " + (a + 1));
                flag = false;
            }

        }

        if ((parseInt(lineCount) + 2) !== x.length) {
            console.log("Not enough lines");
            flag = false;
        }

        if (flag)
            this.setState({
                errors: false,
                code: newCode
            });
        else
            this.setState({
                errors: true
            });
    }

    render() {

        let options = {
            lineNumbers: true,
            theme: "base16-dark",
            styleSelectedText: true,
            viewportMargin: Infinity
        };

        let errorChecker = null;

        if (this.state.errors) {
            errorChecker =
                <div className="error">
                    <div className="errorIndicator"/>
                    <div className="errorText">Errors Present</div>
                </div>
        } else {
            errorChecker =
                <div className="error">
                    <div className="errorIndicator-Green"/>
                    <div className="errorText">No Errors</div>
                </div>
        }

        return (

            <div className="App">
                <div className="App-header">
                    <div className="nav" onClick={this.toggleSideBar}><FontAwesomeIcon icon={faBars}/></div>
                    <img src="images/exabyte-logo.png" className="App-logo" alt="logo"/>
                    <div className="App-location">Material Developer</div>

                    <div className="layout-toggle">
                        Code Split &nbsp;&nbsp;<FontAwesomeIcon icon={faColumns}/> &nbsp;&nbsp;
                        <FontAwesomeIcon icon={faAngleDown}/>
                    </div>

                    <div className="App-avatar">
                        <div className="App-avatar-text"> Mayank Bansal &nbsp; <FontAwesomeIcon icon={faAngleDown}/>
                        </div>

                        <div className="App-avatar-img">
                            <img className="avatar-img" src="images/manky.jpg"/>
                        </div>

                    </div>
                </div>

                {this.state.sideBarInit ?
                    <div className={this.state.sideBar ? "SideBar-Container show" : null}>
                        <div
                            className={this.state.sideBar ? "SideBar animated slideInLeft" : "SideBar animated slideOutLeft"}>
                            {this.loadSideBar()}
                        </div>

                        <div
                            className={this.state.sideBar ? "SideBar-Clickable animated fadeIn" : "SideBar-Clickable animated fadeOut"}
                            onClick={this.toggleSideBar}
                        />
                    </div>
                    : null}

                <div
                    className={this.state.sideBar && this.state.sideBarInit ? "App-container App-container-push" : "App-container"}>
                    <div className="App-menu">
                        {this.loadDesignerMenu()}
                    </div>

                    <div className="App-editor-container">
                        <div className="App-editor-code">

                            {this.state.ProjectBar ?
                                <div className="projectBar">
                                    <b>My Project </b><br/><br/>

                                    <FontAwesomeIcon className="project-folder-icon" icon={faFolderOpen}/> &nbsp;
                                    <div className="project-folder"> Sample Project</div>
                                    <br/><br/>
                                    <FontAwesomeIcon className="project-folder-icon project-push"
                                                     icon={faFile}/> &nbsp;
                                    <div className="project-folder"> <b>benzene.xyz</b></div>
                                    <br/>
                                    <FontAwesomeIcon className="project-folder-icon project-push"
                                                     icon={faFile}/> &nbsp;
                                    <div className="project-folder"> sample.xyz</div>
                                    <br/>
                                    <FontAwesomeIcon className="project-folder-icon project-push"
                                                     icon={faFile}/> &nbsp;
                                    <div className="project-folder"> test.xyz</div>
                                </div>
                                : null}

                            <div className="container-titlebar">
                                <div onClick={this.toggleProjectBar} className="fileDetailsButton">
                                    <FontAwesomeIcon icon={faChevronLeft}/>&nbsp;&nbsp; benzene.xyz
                                </div>

                                <div className="container-title">
                                    <FontAwesomeIcon icon={faCode}/>&nbsp;&nbsp;&nbsp;Source Editor
                                </div>

                                <div onClick={this.toggleSyncHandler} className="container-titlebar-control">
                                    {this.state.sync ? <FontAwesomeIcon icon={faSync} className="ctrlActive"/> :
                                        <FontAwesomeIcon icon={faSync}/>}
                                </div>
                                <div onClick={this.toggleSyncHandler} className="container-titlebar-control">
                                    {this.state.sync ? <FontAwesomeIcon icon={faSave} className="ctrlActive"/> :
                                        <FontAwesomeIcon icon={faSave}/>}
                                </div>
                                {errorChecker}
                            </div>


                            <CodeMirror className="CodeMirror" value={this.state.code} onChange={this.updateCode}
                                        options={options}/>
                        </div>


                        <div className="App-editor-view">

                            <div className="container-titlebar-2">
                                <div className="container-title">
                                    <FontAwesomeIcon icon={faEye}/>&nbsp;&nbsp;&nbsp;Visual Editor
                                </div>
                            </div>

                            <ObjectViewer
                                viewerRotate={this.state.viewerRotate}
                                zoomIn={this.state.zoomIn}
                                zoomOut={this.state.zoomOut}
                                resetRotate={this.state.resetRotate}
                                boundingBox={this.state.boundingBox}
                                axes={this.state.axes}
                                code={this.state.code}
                                errors={this.state.errors}
                            />

                            <div className="compound-details">benzene.xyz</div>

                        </div>

                        <div className="viewer-controls">
                            <div className="viewer-ctrl">
                                <FontAwesomeIcon icon={faExpand}/>
                            </div>

                            <div className="viewer-control-spacer"/>

                            <div onClick={this.toggleAxesHandler} className="viewer-ctrl">
                                {this.state.axes ? <FontAwesomeIcon icon={faAsterisk} className="ctrlActive"/> :
                                    <FontAwesomeIcon icon={faAsterisk}/>}
                            </div>
                            <div onClick={this.toggleBoundHandler} className="viewer-ctrl">
                                {this.state.boundingBox ? <FontAwesomeIcon icon={faCube} className="ctrlActive"/> :
                                    <FontAwesomeIcon icon={faCube}/>}
                            </div>
                            <div onClick={this.resetRotateHandler} className="viewer-ctrl">
                                <FontAwesomeIcon icon={faExpandArrowsAlt}/>
                            </div>

                            <div className="viewer-ctrl">
                                <FontAwesomeIcon icon={faCamera}/>
                            </div>

                            <div onClick={this.rotateHandler} className="viewer-ctrl">
                                {this.state.viewerRotate ? <FontAwesomeIcon icon={faPause} className="ctrlActive"/> :
                                    <FontAwesomeIcon icon={faPlay}/>}
                            </div>
                            <div onClick={this.zoomInHandler} className="viewer-ctrl">
                                <FontAwesomeIcon icon={faSearchPlus}/>
                            </div>
                            <div onClick={this.zoomOutHandler} className="viewer-ctrl">
                                <FontAwesomeIcon icon={faSearchMinus}/>
                            </div>
                        </div>

                    </div>

                    <Terminal/>
                </div>
            </div>
        )
            ;
    }

    loadDesignerMenu() {
        return Object.entries(designerMenu).map(([key, value], i) => {
            return (
                <div key={key} className="App-menu-item">
                    {value.name}
                    <div className="MenuDropDown">{
                        Object.entries(value.dropDowns).map(([dropDownKey, dropDownValue], j) => {
                            return (
                                <div key={dropDownKey} className="MenuDropDown-Item">
                                    {dropDownValue.icon ?
                                        <div><FontAwesomeIcon
                                            className="MenuDropDown-Icons"
                                            icon={dropDownValue.icon}
                                        /> &nbsp; &nbsp; {dropDownValue.name} </div>
                                    :dropDownValue.name}
                                </div>
                            )
                        })
                    }</div>
                </div>
            )
        });
    }

    loadSideBar() {
        return Object.entries(sideBarItems).map(([key, value], i) => {
            return (
                <div key={key} className={this.state.sideBar ? "SideBar-Item animated fadeInLeft" : "SideBar-Item"}>
                    <FontAwesomeIcon icon={value.icon}/> &nbsp; &nbsp;  &nbsp; &nbsp; {value.name}
                </div>
            )
        });
    }
}

class Terminal extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="App-terminal">
                <div className="App-terminal-controls">
                    <div className="App-terminal-ctrl">
                        <FontAwesomeIcon icon={faPlus}/>
                    </div>
                    <div className="App-terminal-ctrl">
                        <FontAwesomeIcon icon={faStop}/>
                    </div>
                    <div className="App-terminal-ctrl">
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                    <div className="App-terminal-ctrl">
                        <FontAwesomeIcon icon={faRedo}/>
                    </div>
                    <div className="App-terminal-ctrl">
                        <FontAwesomeIcon icon={faDownload}/>
                    </div>
                </div>
                <div className="App-terminal-container">
                    <div className="App-terminal-input">
                        <div className="prompt">exabyte-io/demo $</div>
                        <div className="Blinker">|</div>
                    </div>
                </div>

                <div className="compute-usage">
                    CPU Usage
                </div>
            </div>
        )
    }
}

const sideBarItems = [
    {
        id: 1,
        name: 'Home',
        icon: faHome
    }, {
        id: 2,
        name: 'Dashboard',
        icon: faTachometerAlt
    }, {
        id: 2,
        name: 'Projects',
        icon: faFile
    }, {
        id: 2,
        name: 'My Account',
        icon: faUser
    }, {
        id: 2,
        name: 'Support',
        icon: faLifeRing
    }, {
        id: 2,
        name: 'Documentation',
        icon: faBook
    }
];

const designerMenu = [
    {
        id: 1,
        name: "File",
        dropDowns: [{
            name: "New File",
            icon: faFile
        }, {
            name: "Import File",
            icon: faUpload
        }, {
            name: "Open Project",
            icon: faFolderOpen
        }, {
            name: "Save Project",
            icon: faSave
        }, {
            name: "Preferences",
            icon: faCog
        }]
    }, {
        id: 2,
        name: "Edit",
        dropDowns: [{
            name: "Undo   (⌘Z)",
            icon: faUndo
        },{
            name: "Redo   (⌘⇧Z)",
            icon: faRedo
        },{
            name: "Cut    (⌘X)",
            icon: faCut
        }, {
            name: "Copy   (⌘C)",
            icon: faCopy
        }, {
            name: "Paste  (⌘V)",
            icon: faPaste
        }, {
            name: "Delete",
            icon: faTrash
        }]
    }, {
        id: 3,
        name: "View",
        dropDowns: [{
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }]
    }, {
        id: 4,
        name: "Inspect",
        dropDowns: [{
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }]
    }, {
        id: 5,
        name: "Simulations",
        dropDowns: [{
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }]
    }, {
        id: 6,
        name: "Settings",
        dropDowns: [{
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }]
    }, {
        id: 7,
        name: "Help",
        dropDowns: [{
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }, {
            name: "Menu Item",
            icon: false
        }]
    }
];

Meteor.startup(() => {
    render(<App/>, document.getElementById('root'));
});