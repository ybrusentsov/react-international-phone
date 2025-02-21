import React, { useState } from 'react';

import { AntPhone } from './components/AntPhone';
import { ChakraPhone } from './components/ChakraPhone';
import { MuiPhone } from './components/MuiPhone';
import { MuiPhone2 } from './components/MuiPhone2';
import { TailwindHeadlessUIPhone } from './components/Tailwind/TailwindHeadlessUIPhone';

export default {
  title: 'Using with UI libs',
};

export const MaterialUI = () => {
  const [phone, setPhone] = useState('+1123');
  return <MuiPhone value={phone} onChange={setPhone} />;
};

export const MaterialUIStyle2 = () => {
  const [phone, setPhone] = useState('+1123');
  return <MuiPhone2 value={phone} onChange={setPhone} />;
};
MaterialUIStyle2.storyName = 'Material UI (With button)';

export const ChakraUI = () => {
  const [phone, setPhone] = useState('+1123');
  return <ChakraPhone value={phone} onChange={setPhone} />;
};

export const AntDesign = () => {
  const [phone, setPhone] = useState('+1123');
  return <AntPhone value={phone} onChange={setPhone} />;
};


export const TailwindHeadlessUI = () => {
  const [phone, setPhone] = useState('+1123');
  return <TailwindHeadlessUIPhone value={phone} onChange={setPhone} />;
};
