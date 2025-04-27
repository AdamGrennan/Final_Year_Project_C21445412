import { LuBicepsFlexed } from "react-icons/lu";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { PiScalesFill } from "react-icons/pi";
import { FaCloudShowersHeavy, FaHourglassHalf, FaAnchor } from "react-icons/fa";
import { MdOutlineShowChart } from "react-icons/md";

export default function Page() {
    return (
        <div className="min-h-screen p-6 bg-gray-50 font-urbanist">
            <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Sonus</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 bg-gray-100 rounded-lg p-4">
                Sonus is your decision support companion. It helps you spot bias and noise in your thinking by analyzing your input and giving you feedback. Here's how it works and what it looks out for:
            </p>
            <div className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-3 text-gray-800">How Sonus Works</h2>
                <p className="text-gray-600 bg-gray-100 rounded-lg p-4">
                    Sonus uses machine learning to detect common thinking traps. When you input a decision, it analyzes your language and patterns to identify signs of bias like overconfidence or anchoring. It also evaluates external factors like time of day, emotion, or context to detect different types of noise in judgment. The result is real-time, reflective feedback to help you think more clearly and make better decisions.
                </p>
            </div>
            <div className="flex justify-center mb-2">
                <h2 className="text-center font-urbanist font-semibold border-b-[2px] border-PRIMARY pb-1 w-72">
                    Bias Types Detected by Sonus
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="group bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <LuBicepsFlexed className="w-6 h-6 mb-1 mx-auto text-gray-800 group-hover:text-PRIMARY transition-colors duration-300" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-PRIMARY transition-colors duration-300">
                            Overconfidence Bias
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm  text-center">
                        The tendency to overestimate our knowledge, abilities, or the accuracy of our predictions—leading to risky decisions.
                    </p>
                </div>

                <div className="group bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <FaAnchor className="w-6 h-6 mb-1 mx-auto text-gray-800 group-hover:text-PRIMARY transition-colors duration-300" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-PRIMARY transition-colors duration-300">
                            Anchoring Bias
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm  text-center">
                        The tendency to rely heavily on the first piece of information encountered (the “anchor”) when making decisions.
                    </p>
                </div>

                <div className="group bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <FaMagnifyingGlass className="w-6 h-6 mb-1 mx-auto text-gray-800 group-hover:text-PRIMARY transition-colors duration-300" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-PRIMARY transition-colors duration-300">
                            Confirmation Bias
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm  text-center">
                        The tendency to seek out or interpret information in a way that confirms our preexisting beliefs.
                    </p>
                </div>

                <div className="group bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <FaHourglassHalf className="w-6 h-6 mb-1 mx-auto text-gray-800 group-hover:text-PRIMARY transition-colors duration-300" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-PRIMARY transition-colors duration-300">
                            Recency Bias
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm  text-center">
                        The tendency to give greater importance to the most recent events or information over older data.
                    </p>
                </div>
            </div>

            <hr className="border-t border-gray-200 mb-10" />


            <div className="flex justify-center mb-2">
                <h2 className="text-center font-urbanist font-semibold border-b-[2px] border-PRIMARY pb-1 w-72">
                    Noise Types Detected by Sonus
                </h2>
            </div>

            <div className="flex justify-center mb-10">
                <div className="flex flex-wrap justify-center gap-6">
                    <div className="group bg-white shadow-md p-4 rounded-xl w-[270px] hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                            <MdOutlineShowChart className="w-6 h-6 mb-1 mx-auto text-gray-800 group-hover:text-PRIMARY transition-colors duration-300" />
                            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-PRIMARY transition-colors duration-300">
                                Pattern Noise
                            </h2>
                        </div>
                        <p className="text-gray-600 text-sm  text-center">
                            Systematic variation in judgment due to individual tendencies—like two judges consistently disagreeing despite having the same info.
                        </p>
                    </div>

                    <div className="group bg-white shadow-md p-4 rounded-xl w-[270px] hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                            <PiScalesFill className="w-6 h-6 mb-1 mx-auto text-gray-800 group-hover:text-PRIMARY transition-colors duration-300" />
                            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-PRIMARY transition-colors duration-300">
                                Level Noise
                            </h2>
                        </div>
                        <p className="text-gray-600 text-sm text-center">
                            Differences in average judgment levels across individuals—like some being harsher or more lenient overall.
                        </p>
                    </div>

                    <div className="group bg-white shadow-md p-4 rounded-xl w-[270px] hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                            <FaCloudShowersHeavy className="w-6 h-6 mb-1 mx-auto text-gray-800 group-hover:text-PRIMARY transition-colors duration-300" />
                            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-PRIMARY transition-colors duration-300">
                                Occasion Noise
                            </h2>
                        </div>
                        <p className="text-gray-600 text-sm  text-center">
                            Inconsistency caused by external factors like time of day, mood, hunger, or even weather when making judgments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
