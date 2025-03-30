"use client";

import React from "react";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UserLogSchema } from "@/schemas/userLog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

type FormData = z.infer<typeof UserLogSchema>;
const page = () => {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(UserLogSchema),
    });

    const onSubmit = async (data: any) => {
        console.log(data);
        setOpen(false);

        const response = await axios.post("/api/usage", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            console.log("Data submitted successfully");
            router.push("/usage");
        } else {
            console.error("Error submitting data");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Open Form</Button>
            </DialogTrigger>
            <DialogContent>
                <h2 className="text-lg font-semibold">
                    Enter Your Electricity Details
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label>Units Used</label>
                        <Input
                            type="number"
                            {...register("unitsUsed", { valueAsNumber: true })}
                        />
                        {errors.unitsUsed && (
                            <p className="text-red-500">
                                {errors.unitsUsed.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label>Per Unit Cost</label>
                        <Input
                            type="number"
                            {...register("perUnitCost", {
                                valueAsNumber: true,
                            })}
                        />
                        {errors.perUnitCost && (
                            <p className="text-red-500">
                                {errors.perUnitCost.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label>Total Bill</label>
                        <Input
                            type="number"
                            {...register("totalBill", { valueAsNumber: true })}
                        />
                        {errors.totalBill && (
                            <p className="text-red-500">
                                {errors.totalBill.message}
                            </p>
                        )}
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default page;
