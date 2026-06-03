"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Props } from "../edit/_components/edit-user-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserDetailsTable(user: Props) {
  return (
    <div className="flex-col mx-auto max-w-3xl">
      <div className="m-5 border">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-right">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-sidebar-accent">
            <TableRow>
              <TableCell className="text-left truncate max-w-20 md:max-w-full">
                {user.data.name}
              </TableCell>
              <TableCell className="text-center">{user.data.role}</TableCell>
              <TableCell className="text-right truncate max-w-20 md:max-w-full">
                {user.data.email}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="m-5 border">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead>Birthdate</TableHead>
              <TableHead className="text-center">Phone</TableHead>
              <TableHead className="text-right">Author alias</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-sidebar-accent">
            <TableRow>
              <TableCell className="text-left">
                {new Intl.DateTimeFormat("sv-SE").format(
                  user.data.user_info?.birthdate,
                ) ?? ""}
              </TableCell>
              <TableCell className="text-center">
                {user.data.user_info?.phoneNumber ?? ""}
              </TableCell>
              <TableCell className="text-right">
                {user.data.author?.alias ?? ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="m-5 border">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead>Street</TableHead>
              <TableHead className="text-center">City</TableHead>
              <TableHead className="text-center">Zip</TableHead>
              <TableHead className="text-right">Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-sidebar-accent">
            <TableRow>
              <TableCell className="text-left">
                {user.data.user_info?.address.street ?? ""}
              </TableCell>
              <TableCell className="text-center">
                {user.data.user_info?.address.city ?? ""}
              </TableCell>
              <TableCell className="text-center">
                {user.data.user_info?.address.zip ?? ""}
              </TableCell>
              <TableCell className="text-right">
                {user.data.user_info?.address.country ?? ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
