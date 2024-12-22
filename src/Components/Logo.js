import React from 'react'
import { Image, Dimensions } from 'react-native'

const { fontScale } = Dimensions.get('window')

const Logo = ({ size = 60 }) => (
  <Image style={{ height: fontScale * size, width: fontScale * size }} source={require('../../assets/chocolarium-ljubljana.png')} />
)

export default Logo
