import React from 'react'

interface Props {
    title: String;
    iconSrc: String;
    value: String;
    borderColor: String;
}
const PriceInfoCard = ({
    title,
    iconSrc,
    value,
    borderColor
} : Props) => {
  return (
    <div>PriceInfoCard</div>
  )
}

export default PriceInfoCard