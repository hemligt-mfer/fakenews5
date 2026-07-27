"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Props } from "../edit/_components/edit-user-form";

export default function UserDetailsTable(user: Props) {
  return (
    <Table className="md:w-xl mt-5 border-l-2">
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">Name</TableCell>
          <TableCell className="capitalize">{user.data.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Role</TableCell>
          <TableCell className="capitalize">{user.data.role}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Email</TableCell>
          <TableCell className="truncate max-w-20 md:max-w-full">
            {user.data.email}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">ID</TableCell>
          <TableCell className="truncate max-w-20 md:max-w-full">
            {user.data.id}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">User created at</TableCell>
          <TableCell className="">
            {new Intl.DateTimeFormat("sv-SE").format(
              user.data.createdAt,
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Birthdate</TableCell>
          <TableCell className="">
            {new Intl.DateTimeFormat("sv-SE").format(
              user.data.user_info?.birthdate,
            ) ?? ""}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Phone</TableCell>
          <TableCell className="">
            {user.data.user_info?.phoneNumber ?? ""}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Author name</TableCell>
          <TableCell className="">
            {user.data.author?.alias ?? ""}
          </TableCell>
        </TableRow>
        <TableRow >
          <TableCell className="font-semibold">Street</TableCell>
          <TableCell className="">
           {user.data.user_info?.address.street ?? ""}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">City</TableCell>
          <TableCell className="">
           {user.data.user_info?.address.city ?? ""}
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-semibold">Zip</TableCell>
          <TableCell className="">
           {user.data.user_info?.address.zip ?? ""}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Country</TableCell>
          <TableCell className="">
           {user.data.user_info?.address.country ?? ""}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
