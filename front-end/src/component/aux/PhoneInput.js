import React from 'react'
import MaskedInput from 'react-text-mask'

export default () => (
  <div>
    {/* <label><strong>Masked input</strong></label> */}
    <MaskedInput
      // Phone number mask
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
    />
  </div>
)