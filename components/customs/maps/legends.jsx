import { FaUserAlt, FaUserNurse, FaUserSecret } from "react-icons/fa";

export default function Legends() {

    return (
        <>
            <div className="justify-center items-center gap-5 flex mt-3">
                <div className="flex items-center gap-1">
                    <FaUserAlt className="text-violet-600" />
                    Polsek
                </div>
                <div className="flex items-center gap-1">
                    <FaUserSecret className="text-green-600" />
                    Polda
                </div>
                <div className="flex items-center gap-1">
                    <FaUserNurse className="text-cyan-600" />
                    Polres
                </div>
            </div>
        </>
    )
}