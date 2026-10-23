import React from "react";
import { motion } from "framer-motion";
import {
    FiCheckSquare as CheckCheck,
} from "react-icons/fi";
import Button from "@/app/_components/button";

export default function BatchEndorseButton({ selectedCount, onClick, loading }) {
    return (
        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }}>
            <Button
                variant="success"
                disabled={selectedCount === 0}
                loading={loading}
                onClick={onClick}
                className="gap-2 !py-2.5 text-sm"
            >
                <CheckCheck size={16} aria-hidden="true" />
                Approve Selected{selectedCount > 0 ? ` (${selectedCount})` : ""}
            </Button>
        </motion.div>
    );
}
