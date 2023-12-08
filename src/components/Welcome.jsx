import { LoginCard, Button } from '.';
import logoTagline from '../assets/curioLogoTagline.png'

const Welcome = ({ loginCallback, setClickedAbout }) => (
  <>
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center mb-5">
        <img src={logoTagline} className="md:w-[500px] w-[400px]" />
        <p className="mt-5 text-white font-light text-center text-2xl">
          Helping technical product marketers craft compelling content faster.
        </p>
      </div>
      <div className="border-t border-gray-200" />
      <div className="bg-gradient-to-b from-[#3A1F5C] via-[#006c67] to-[#ffc857]">
        <div className="text-white p-10 ml-10 mr-10 text-lg">
          <p>
            <a
              className="bg-gradient-to-r from-[#ffc857] to-red-300 text-transparent underline-offset-4 decoration-red-300 bg-clip-text underline hover:no-underline"
              href="https://www.fixate.io"
            >
              Fixate IO
            </a>
            's years of experience in technical content marketing has taught us
            that the topic curation process is a high hurdle that often derails
            content strategy. Figuring out what your target audience wants to
            read can be the most challenging part of the content creation
            process.
          </p>
          <br />
          <p>
            So we created Curio, a free tool for curating high-quality,
            industry-specific topics and abstracts! Leveraging OpenAI in
            conjunction with Fixate’s Virtual Domain Experts models, Curio helps
            companies curate content topics faster, so they can accelerate the
            content creation and publishing process.
          </p>
        </div>
        <div className="text-white text-lg flex place-items-center">
          <div className="font-semibold mr-10 ml-10 p-10">
            <h3 className="text-center text-4xl font-bold">
              How does Curio work?
            </h3>
            <br />
            <br />
            <p>
              Input industry-specific keywords of your choosing, or let Curio
              recommend them for you. From there, Curio curates an unlimited
              number of variations of titles and abstracts for blogs,
              whitepapers, eBooks and other content based on topics relevant for
              your industry segment.
            </p>
            <br />
            <p>
              Save the topics that align with your content strategy and send
              them to Fixate to get them written by industry experts. Or, use
              Curio’s feature to export to Google Docs and write the content on
              your own.
            </p>
          </div>
        </div>
        <div className="text-white flex place-items-center">
          <div className="pl-10 pr-10 text-lg font-semibold ml-10 mr-10">
            <h3 className="text-center text-4xl font-bold">
              Accelerated Inspiration
            </h3>
            <br />
            <br />
            <p>
              Curio is a source of accelerated inspiration that helps you
              identify the best content topics, break through writer’s block and
              produce content that will have the highest impact on your target
              audiences.
            </p>
          </div>
        </div>
        <div className="text-white">
          <div className="pb-10 pt-10 pl-20 pr-20 text-lg font-semibold">
            <h3 className="text-center text-4xl font-bold">What next?</h3>
            <br />
            <p>
              Log in with your Google Workspace account and start generating
              topics today! Using Curio is free, and Fixate customers get
              automatic access to new functionality as it is released.
            </p>
          </div>
        </div>
      </div>
      {setClickedAbout ? (
        <>
          <Button
            customStyles="bg-white py-2 px-7 rounded-full mt-10 cursor-pointer font-bold text-[#2D104F] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 w-1/6 self-center"
            handleClick={() => setClickedAbout((prev) => !prev)}
            text="Close"
          />
          <div className="invisible mt-3">blank div</div>
        </>
      ) : null}
    </div>
    {loginCallback ? <LoginCard loginCallback={loginCallback} /> : null}
  </>
);

export default Welcome;
