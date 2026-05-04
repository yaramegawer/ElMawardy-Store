import SocialMediaFooter from "./SocialMediaFooter";


const Footer = () => {
  return (
    <>
      <SocialMediaFooter />
      <footer className="max-w-screen-2xl mx-auto border-b-8 border-secondaryBrown px-5 max-[400px]:px-3">
        
        <div className="flex flex-col gap-8 my-20">
          <h2 className="text-6xl font-light text-center max-sm:text-5xl">Ayla HomeWear</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm text-gray-600">
                
                <p>Phone: +201092851229</p>
                <p>Phone: +201033727566</p>
                <p>WhatsApp: +201092851229</p>
                <p>WhatsApp: +201033727566</p>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Address</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Egypt, Giza</p>
                <p>6th of October city</p>
                <p>Family mall 2nd floor</p>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Opening Hours</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Monday - Saturday</p>
                <p>12:00 PM - 11:00 PM</p>
                <p className="text-red-600 font-medium">Closed on Sunday</p>
              </div>
            </div>
            
          </div>
          
          <p className="text-base text-center max-sm:text-sm">All rights reserved {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
};
export default Footer;
