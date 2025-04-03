import { LuBicepsFlexed } from "react-icons/lu";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { PiScalesFill } from "react-icons/pi";
import { FaCloudShowersHeavy, FaHourglassHalf, FaAnchor } from "react-icons/fa";
import { MdOutlineShowChart } from "react-icons/md";

export default function Page() {
    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Sonus</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
                Sonus is your decision support companion. It helps you spot bias and noise in your thinking by analyzing your input and giving you feedback. Here's how it works and what it looks out for:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transition-all duration-300">
                    <LuBicepsFlexed className="w-6 h-6 mb-1" />
                    <h2 className="text-xl font-semibold mb-2">Overconfidence Bias</h2>
                    <p className="text-gray-600 text-sm">
                        The tendency to overestimate our knowledge, abilities, or the accuracy of our predictions—leading to risky decisions.
                        <br />
                    </p>
                </div>
                <div className="bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transition-all duration-300">
                    <FaAnchor className="w-6 h-6 mb-1" />
                    <h2 className="text-xl font-semibold mb-2">Anchoring Bias</h2>
                    <p className="text-gray-600 text-sm">
                        The tendency to rely heavily on the first piece of information encountered (the “anchor”) when making decisions.
                        <br />
                    </p>
                </div>
                <div className="bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transition-all duration-300">
                    <FaMagnifyingGlass className="w-6 h-6 mb-1" />
                    <h2 className="text-xl font-semibold mb-2">Confirmation Bias</h2>
                    <p className="text-gray-600 text-sm">
                        The tendency to seek out or interpret information in a way that confirms our preexisting beliefs.
                        <br />
                    </p>
                </div>
                <div className="bg-white shadow-md p-4 rounded-xl hover:bg-gray-200 transition-all duration-300">
                    <FaHourglassHalf className="w-6 h-6 mb-1" />
                    <h2 className="text-xl font-semibold mb-2">Recency Bias</h2>
                    <p className="text-gray-600 text-sm">
                        The tendency to give greater importance to the most recent events or information over older data.
                        <br />
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="flex justify-center mb-10">
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="bg-white shadow-md p-4 rounded-xl w-[270px] hover:bg-gray-200 transition-all duration-300">
                            <MdOutlineShowChart className="w-6 h-6 mb-1" />
                            <h2 className="text-xl font-semibold mb-2">Pattern Noise</h2>
                            <p className="text-gray-600 text-sm">
                                Systematic variation in judgment due to individual tendencies—like two judges consistently disagreeing despite having the same info.
                            </p>
                        </div>
                        <div className="bg-white shadow-md p-4 rounded-xl w-[270px] hover:bg-gray-200 transition-all duration-300">
                            <PiScalesFill className="w-6 h-6 mb-1" />
                            <h2 className="text-xl font-semibold mb-2">Level Noise</h2>
                            <p className="text-gray-600 text-sm">
                                Differences in average judgment levels across individuals—like some being harsher or more lenient overall.
                            </p>
                        </div>
                        <div className="bg-white shadow-md p-4 rounded-xl w-[270px] hover:bg-gray-200 transition-all duration-300">
                            <FaCloudShowersHeavy className="w-6 h-6 mb-1" />
                            <h2 className="text-xl font-semibold mb-2">Occasion Noise</h2>
                            <p className="text-gray-600 text-sm">
                                Inconsistency caused by external factors like time of day, mood, hunger, or even weather when making judgments.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
