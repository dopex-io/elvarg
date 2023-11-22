export const STEP = 0.1;
export const MIN_VAL = 1;
export const MAX_VAL = 20;
export const MARKS = [
  {
    value: 1,
    label: '1%',
  },
  {
    value: 5,
    label: '5%',
  },
  {
    value: 10,
    label: '10%',
  },
  {
    value: 15,
    label: '15%',
  },
  {
    value: 20,
    label: '20%',
  },
];

const customSliderStyle = {
  '.MuiSlider-markLabel': {
    color: 'white',
  },
  '.MuiSlider-rail': {
    color: '#3E3E3E',
  },
  '.MuiSlider-mark': {
    color: 'white',
  },
  '.MuiSlider-thumb': {
    color: 'white',
    width: '16px',
    height: '16px',
  },
  '.MuiSlider-track': {
    color: '#22E1FF',
  },
};

export default customSliderStyle;
