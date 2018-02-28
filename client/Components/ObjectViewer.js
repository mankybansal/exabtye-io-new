import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

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

export default ObjectViewer