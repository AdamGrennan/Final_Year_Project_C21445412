"use client"
import { useBias } from "@/context/BiasContext";

export default function Page(){
    const { biasCount } = useBias();

    return(
        <div>
            <h2>Bias Counts</h2>
            {Object.entries(biasCount).map(([bias, count]) => (
                <p key={bias}>{`${bias}: ${count}`}</p>
            ))}
        </div>
    );
}