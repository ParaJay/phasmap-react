import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Ghosts from './Ghosts';
import Maps from './Maps';
import CursedItem from './CursedItems';
import Equipment from './Equipment';
import Journal from './Journal';
import Difficulty from './Difficulty';
import PhotoRewards from './PhotoRewards';
import PhotoRandomizer from './photorandomizer/PhotoRandomizer';

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
      <Route exact path='/phasmap-react/photorandomizer' element={<PhotoRandomizer/>}></Route>
      <Route exact path='/phasmap-react/photorewards' element={<PhotoRewards/>}></Route>

      <Route exact path='/' element={<Maps/>}></Route>
      <Route exact path='/index' element={<Maps/>}></Route>
      <Route path='/ghosts' element={<Ghosts/>}></Route>
      <Route exact path='/curseditems' element={<CursedItem/>}></Route>
      <Route exact path='/equipment' element={<Equipment/>}></Route>
      <Route exact path='/journal' element={<Journal/>}></Route>
      <Route exact path='/difficulty' element={<Difficulty/>}></Route>
      <Route exact path='/photorandomizer' element={<PhotoRandomizer/>}></Route>
      <Route exact path='/photorewards' element={<PhotoRewards/>}></Route>
    </Routes>
  );
}

export default Main;