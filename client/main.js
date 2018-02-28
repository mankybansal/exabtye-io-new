// TODO: add "Create new" file in menu with popup
// TODO: create menu for account
// TODO: show errors
// TODO: add code split menu
// TODO: fix terminal shadow and add terminal label
// TODO: add project viewer
// TODO: add welcome popup
// TODO: add autosaved icon

import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';

import * as THREE from 'three';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import CodeMirror from 'react-codemirror'

import {
    faCamera,
    faSearchPlus,
    faColumns,
    faSearchMinus,
    faExpand,
    faExpandArrowsAlt,
    faPause,
    faCube,
    faAsterisk,
    faChevronLeft,
    faPlay,
    faAngleDown,
    faBars,
    faStop,
    faCode,
    faEye,
    faSync,
    faTimes,
    faRedo,
    faPlus,
    faDownload
} from '@fortawesome/fontawesome-free-solid'
import OrbitControls from 'three-orbitcontrols';

import '../node_modules/codemirror/lib/codemirror.css'
import '../node_modules/codemirror/theme/base16-dark.css'
import '../node_modules/codemirror/addon/selection/active-line'
import './styles.css'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewerRotate: true,
            resetRotate: false,
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

                            <div className="container-titlebar">
                                <div className="fileDetailsButton">
                                    <FontAwesomeIcon icon={faChevronLeft}/>&nbsp;&nbsp; benzene.xyz
                                </div>

                                <div className="container-title">
                                    <FontAwesomeIcon icon={faCode}/>&nbsp;&nbsp;&nbsp;Source Editor
                                </div>

                                <div onClick={this.toggleSyncHandler }  className="container-titlebar-control">
                                    {this.state.sync ? <FontAwesomeIcon icon={faSync} className="ctrlActive"/>:
                                        <FontAwesomeIcon icon={faSync}/>}
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
                                <div key={dropDownKey} className="MenuDropDown-Item">{dropDownValue.name}</div>
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
                    {value.name}
                </div>
            )
        });
    }
}


class ObjectViewer extends Component {
    constructor(props) {
        super(props);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        this.viewerFile = {
            atomCount: 0,
            comment: "",
            atoms: []
        };
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({antialias: true});

        const group = new THREE.Group;
        const childGroup = this.createGroup();

        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.position.set(0, 0, 0);
        axesHelper.name = "axesHelper";

        const edges = new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(5, 5, 5));
        const boundingBox = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xffffff}));
        boundingBox.name = "boundingBox";

        group.add(boundingBox);
        group.add(childGroup);
        group.add(axesHelper);

        group.name = "parentGroup";

        scene.add(group);

        camera.position.z = 8;

        renderer.setClearColor('#111111');
        renderer.setSize(width, height);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.cube = group;
        this.axes = axesHelper;
        this.controls = controls;

        this.mount.appendChild(this.renderer.domElement);
        this.start()
    }

    createGroup() {
        let cubes = [];
        let material = null;
        let geometry = null;
        let group = new THREE.Group();

        for (let i = 0; i < this.viewerFile.atomCount; i++) {

            let defcolor = 0x00ff00;
            let defgeometry = 0.5;
            switch (this.viewerFile.atoms[i].element) {
                case "C":
                    defcolor = 0x999999;
                    defgeometry = 0.5;
                    break;
                case "H":
                    defcolor = 0xfffffff;
                    defgeometry = 0.35;
                    break;
                case "O":
                    defcolor = 0xff0000;
                    defgeometry = 0.42;
                    break;
                case "N":
                    defcolor = 0x0000ff;
                    defgeometry = 0.43;
                    break;
                case "He":
                    defcolor = 0x00ff00;
                    defgeometry = 0.43;
                    break;

            }

            geometry = new THREE.SphereBufferGeometry(defgeometry, 50, 50);
            material = new THREE.MeshBasicMaterial({color: defcolor});
            cubes[i] = new THREE.Mesh(geometry, material);
            cubes[i].position.set(this.viewerFile.atoms[i].x, this.viewerFile.atoms[i].y, this.viewerFile.atoms[i].z);
            group.add(cubes[i]);
        }

        group.name = "atomGroup";
        return group;
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement)
    }

    start() {
        if (!this.frameId)
            this.frameId = requestAnimationFrame(this.animate)
    }

    stop() {
        cancelAnimationFrame(this.frameId)
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.resetRotate) {
            this.cube.rotation.x = 0;
            this.cube.rotation.y = 0;
            this.cube.rotation.z = 0;
            this.axes.rotation.x = 0;
            this.axes.rotation.y = 0;
            this.axes.rotation.z = 0;
            this.controls.reset();
            this.camera.zoom = 1;
        }

        if (nextProps.code) {
            this.processCode(nextProps.code);
        }

        if (nextProps.errors) {
            console.log("Errors Exist in this code");
        }

        if (nextProps.zoomIn) {
            this.camera.zoom *= 1.05;
            this.camera.updateProjectionMatrix();
        }

        if (nextProps.zoomOut) {
            this.camera.zoom /= 1.05;
            this.camera.updateProjectionMatrix();
        }

        return true;
    }

    processCode(code) {
        let x = code.split('\n');


        let viewerFile = {
            atomCount: null,
            comment: "",
            atoms: []
        };


        for (let a = 0; a < x.length; a++) {

            let y = x[a].replace(/ +(?= )/g, '').split(" ");

            if (a === 0) viewerFile.atomCount = y[0];
            if (a === 1) viewerFile.comment = y.join(" ");
            if (a > 1) {
                let atom = {
                    element: y[0],
                    x: parseFloat(y[1]),
                    y: parseFloat(y[2]),
                    z: parseFloat(y[3])
                };

                viewerFile.atoms.push(atom);
            }

        }

        //console.log(viewerFile);

        this.viewerFile = viewerFile;

        //console.log(this.scene.getObjectByName("atomGroup"));

        this.scene.getObjectByName("parentGroup").remove(this.scene.getObjectByName("atomGroup"));

        const group = this.createGroup();

        this.scene.getObjectByName("parentGroup").add(group);

    }

    autoRotate() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.cube.rotation.y += 0.00;
    }

    animate() {
        this.controls.update();
        this.renderScene();

        if (this.props.viewerRotate)
            this.autoRotate();

        this.scene.getObjectByName("boundingBox").visible = this.props.boundingBox;
        this.scene.getObjectByName("axesHelper").visible = this.props.axes;

        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
            <div className="renderer" ref={(mount) => {
                this.mount = mount
            }}/>
        )
    }
}

const sideBarItems = [
    {
        id: 1,
        name: 'Home'
    }, {
        id: 2,
        name: 'Dashboard'
    }, {
        id: 2,
        name: 'Projects'
    }, {
        id: 2,
        name: 'My Account'
    }, {
        id: 2,
        name: 'Support'
    }, {
        id: 2,
        name: 'Documentation'
    }
];

const designerMenu = [
    {
        id: 1,
        name: "File",
        dropDowns: [{
            name: "New File"
        }, {
            name: "Import File"
        }, {
            name: "Open Project"
        }, {
            name: "Save Project"
        }, {
            name: "Preferences"
        }]
    }, {
        id: 2,
        name: "Edit",
        dropDowns: [{
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }]
    }, {
        id: 3,
        name: "View",
        dropDowns: [{
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }]
    }, {
        id: 4,
        name: "Inspect",
        dropDowns: [{
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }]
    }, {
        id: 5,
        name: "Simulations",
        dropDowns: [{
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }]
    }, {
        id: 6,
        name: "Settings",
        dropDowns: [{
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }]
    }, {
        id: 7,
        name: "Help",
        dropDowns: [{
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }, {
            name: "Menu Item"
        }]
    }
];

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

Meteor.startup(() => {
    render(<App/>, document.getElementById('root'));
});