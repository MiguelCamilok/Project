import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { hora: "10:00", uso: 30 },
    { hora: "11:00", uso: 50 },
    { hora: "12:00", uso: 20 },
    { hora: "13:00", uso: 80 },
];

function Historial() {
    return (
        <div>
            <h2>Historial de Uso</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uso" stroke="#a52a2a" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Historial;
