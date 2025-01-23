export default function Footer(){
    return (
        <footer>
        <div className="bg-ssblack grid grid-auto-fit  w-full">
              <div className="m-10">
                <a className="text-ssgray">Office hours</a>
                  <ul className="text-white">
                    <li>Monday - Friday: <a className="text-ssblue">8:30am–5pm</a></li>
                    <li>Saturday: <a className="text-ssblue">8:30am- 1pm</a></li>
                    <li>Sunday/Public Holiday: Closed</li>
                  </ul>
              </div>


              <div className="m-10">
              <a className="text-ssgray">Location</a>
                  <ul className="text-white">
                    <li>Smile Studio Dental Clinic</li>
                    <li>3rd Floor, <a className="text-ssblue underline" target="_blank" href="https://maps.app.goo.gl/KmQqxDPdhHk4udwh6">Yaya Centre</a></li>
                    <li>Postal Address: P. O.Box 104364-00100</li>
                    <li>Nairobi, Kenya</li>
                  </ul>
              </div>

              <div className="m-10">
                <a className="text-ssgray">Contact Information</a>
                <ul className="text-white">
                  <li>Email: <a className="text-ssblue underline" href="#">info@smilestudio.biz</a></li>
                  <li>Call: (+254) 20- 4400622 | 0711 279 035</li>
                </ul>

              </div>
        </div>
     </footer>
    )
}