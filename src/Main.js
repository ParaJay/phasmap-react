import "./styles/main.css";
import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Ghosts from './scripts/ghosts';
import Maps from './scripts/maps';
import CursedItem from './scripts/cursed-items';
import Equipment from './scripts/equipment';
import Journal from './scripts/journal';
import Difficulty from './scripts/difficulty';

const Main = () => {
  return (
    <Routes>{}
      <Route exact path='/phasmap-react/' element={<Maps/>}></Route>
      <Route exact path='/phasmap-react/index' element={<Maps/>}></Route>
      <Route exact path='/phasmap-react/ghosts' element={<Ghosts/>}></Route>
      <Route exact path='/phasmap-react/curseditems' element={<CursedItem/>}></Route>
      <Route exact path='/phasmap-react/equipment' element={<Equipment/>}></Route>
      <Route exact path='/phasmap-react/journal' element={<Journal/>}></Route>
      <Route exact path='/phasmap-react/difficulty' element={<Difficulty/>}></Route>

      <Route exact path='/' element={<Maps/>}></Route>
      <Route exact path='/index' element={<Maps/>}></Route>
      <Route path='/ghosts' element={<Ghosts/>}></Route>
      <Route exact path='/curseditems' element={<CursedItem/>}></Route>
      <Route exact path='/equipment' element={<Equipment/>}></Route>
      <Route exact path='/journal' element={<Journal/>}></Route>
      <Route exact path='/difficulty' element={<Difficulty/>}></Route>

      {/* <Route path='/#/' element={<Maps/>}></Route>
      <Route path='/#/index' element={<Maps/>}></Route>
      <Route path='/#/ghosts' element={<Ghosts/>}></Route>
      <Route path='/#/curseditems' element={<CursedItem/>}></Route>
      <Route path='/#/equipment' element={<Equipment/>}></Route>
      <Route path='/#/journal' element={<Journal/>}></Route>
      <Route path='/#/difficulty' element={<Difficulty/>}></Route> */}
      {/* <Route exact path='/signup' component={Signup}></Route> */}
    </Routes>
  );
}

export default Main;