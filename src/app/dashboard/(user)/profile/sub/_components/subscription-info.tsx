"use client";

import { Subscription } from "@better-auth/stripe";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import CancelButton from "./cancel-button";
import RestoreButton from "./restore-button";

export default function SubscriptionInfo({
    subscription,
    price,
    canceledAt,
}: {
    subscription: Subscription;
    price: string;
    canceledAt: Date | undefined;
}) {
    if (subscription && subscription.stripeSubscriptionId) {
        return (
            <>
                <Table className="md:w-xl mx-auto mt-5">
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">Plan</TableCell>
                            <TableCell className="capitalize">{subscription.plan}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Status</TableCell>
                            <TableCell className="capitalize">
                                {subscription.cancelAt ? "Cancelled" : subscription.status}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Cost</TableCell>
                            <TableCell>{price}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Started</TableCell>
                            <TableCell>
                                {subscription.periodStart
                                    ? format(subscription.periodStart, "yyyy-MM-dd")
                                    : ""}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                {canceledAt ? "Ends" : "Renews"}
                            </TableCell>
                            <TableCell>
                                {subscription.periodEnd
                                    ? formatDistanceToNow(subscription.periodEnd, {
                                          addSuffix: true,
                                      })
                                    : ""}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Actions</TableCell>
                            <TableCell>
                                {!canceledAt ? (
                                    <CancelButton
                                        subscriptionId={subscription.stripeSubscriptionId}
                                    />
                                ) : (
                                    <RestoreButton
                                        subscriptionId={subscription.stripeSubscriptionId}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </>
        );
    } else {
        return <p>No subscription found.</p>;
    }
}
