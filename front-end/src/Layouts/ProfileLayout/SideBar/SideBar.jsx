


import React from 'react'

function SideBar()  {
  return (
    <div class="main">
        <div class="profile">
            <div class="profile_content">
                <div class="profile_pic">
                    <div class="picture">
                        <img src="./assets/images/profile.png" class="sample-image"></img>
                        <p>Name</p>
                        <p>Date</p>
                    </div>
                    <div>
                        <h1>Manage Account</h1>
                        <ul>
                            <li>Persional Info</li>
                            <li>Addresses</li>
                            <li>Communications & Privacy</li>
                        </ul>
                    </div>
                    <div>
                        <h1>My item</h1>
                        <ul>
                            <li>Reorder</li>
                            <li>Lists</li>
                            <li>Registries</li>
                        </ul>
                    </div>
                    <div>
                        <h1>Supscription & Plans</h1>
                        <p>Protections Plan</p>

                    </div>
                    <div>
                        <h1>Customer Service</h1>
                        <ul>
                            <li>Help</li>
                            <li>Terms of Use</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
      </div>
  )
}

export default SideBar
