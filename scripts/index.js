import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {GUI} from 'dat.gui'
const foxModelURL =  new URL('../assets/models/Fox.gltf',import.meta.url)
const treeModelURL =  new URL('../assets/models/Tree.gltf',import.meta.url)

const gui = new GUI();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0x1e3799);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
45,
window.innerWidth / window.innerHeight,
0.1,
1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);


const parameters = {
position: 0.5,
rotation:0,
color: '#ff0000',
sounds: false,
zoom:1,

};
let audio = new Audio();
audio.src = '../assets/sounds/birds-sound.mp3';
const cameraZoom = gui.add(parameters,'zoom',1,15);
const addSound = gui.add(parameters,'sounds',false,true);

addSound.onChange((status)=>{
console.log(status)

if(status){

audio.play();
}
else {
audio.pause();
audio.currentTime = 0;
}
})
const foxPosition = gui.add(parameters, 'position', -1, 1); 
const foxRotation = gui.add(parameters, 'rotation', 0, 30); 

const radius = 1; // Radius of the sphere
const widthSegments = 32; // Number of horizontal segments
const heightSegments = 32; // Number of vertical segments
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

// Create a material
const material = new THREE.MeshPhongMaterial({
color: 0xffddaa, // Set the base color of the material
emissive: 0xff6600, // Set the emissive color (glow) of the material
shininess: 100, // Set the shininess of the material (affects specular highlights)
});
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(1, 1, 1);
scene.add(sunlight);

// Create a mesh using the geometry and material
const sphereMesh = new THREE.Mesh(sphereGeometry, material);    
sphereMesh.position.set(0,7,5);
sphereMesh.castShadow = true;
sphereMesh.receiveShadow = false;
const foxColorChanger =  gui.addColor(parameters, 'color');  
// gui.add(parameters, 'options', parameters.options); 

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);


// Camera positioning
camera.position.set(12, 12, 12);
camera.lookAt(scene.position)
orbit.update();

// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);
gridHelper.material.color.set('#f6b93b');
gridHelper.material.opacity = 1; // Set the opacity of the grid material
gridHelper.material.transparent = false; // Enable transparency
gridHelper.material.depthWrite = true; // Disable depth writing for the grid
gridHelper.material.color.setHex(0xf5f6fa); // Set the color of the grid


// this won't move so sun can rotate around 
const staticGroup = new THREE.Group();

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);


const loader =  new GLTFLoader();

const changeColor = (meshName,meshColor,model) => {
model.getObjectByName(meshName).material.color.setHex(meshColor)

}

loader.load(treeModelURL.href,(gltf)=>{
const treeModel = gltf.scene;
treeModel.position.x=3;

console.log(treeModel.children) 
treeModel.getObjectByName('Cube002').material.color.setHex(0xc23616)
treeModel.getObjectByName('Cube002_1').material.color.setHex(0x4cd137)

staticGroup.add(treeModel)
scene.add(treeModel)
})


loader.load(foxModelURL.href,(gltf)=>{
const model = gltf.scene;

foxPosition.onChange((position)=>{

model.position.z+=position;
})
foxRotation.onChange((rotation)=>{
model.rotation.y+=rotation;
})
staticGroup.add(model)
scene.add(model)


foxColorChanger.onChange(color => {

changeColor('Cube',parseInt(color.replace('#',''),16),model)



})




})
scene.add(sphereMesh);

function animate() {
renderer.render(scene, camera);
sphereMesh.rotation.y+=1;

}


renderer.setAnimationLoop(animate);
cameraZoom.onChange(zoom => {
camera.position.set(zoom,zoom,zoom)
})
window.addEventListener('resize', function() {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});