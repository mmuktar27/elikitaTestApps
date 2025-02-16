"use client";
import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { Building, ChevronsUpDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
//import { useLoading } from "../shared/AppLoader";

const ROLE_ROUTES = {
  "system admin": "/admin",

  "healthcare admin": "/healthadmin",
  "healthcare assistant": "/healthassistant",
  doctor: "/doctor",
  "remote doctor": "/remotedoctor",

  "lab technician": "/labtechnician",
};

const PATH_TO_ROLE = Object.entries(ROLE_ROUTES).reduce((acc, [role, path]) => {
  acc[path] = role;
  return acc;
}, {});

export default function TeamSwitcher({ roles }) {
  //const { startLoading, stopLoading } = useLoading();

  const router = useRouter();
  const pathname = usePathname();

  const teamselect = React.useMemo(
    () =>
      (roles || [])
        .filter((role) => role !== "staff")
        .map((role) => ({
          label: role,
          value: role,
        })),
    [roles],
  );

  const [open, setOpen] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(() => {
    const currentRole = PATH_TO_ROLE[pathname];
    const matchingTeam = teamselect.find((team) => team.label === currentRole);
    return matchingTeam || (teamselect.length > 0 ? teamselect[0] : null);
  });

  useEffect(() => {
    //startLoading();

    const currentRole = PATH_TO_ROLE[pathname];
    const matchingTeam = teamselect.find((team) => team.label === currentRole);

    if (matchingTeam) {
      setSelectedTeam(matchingTeam);
      //stopLoading();
    } else if (
      teamselect.length > 0 &&
      !teamselect.find((team) => team.label === selectedTeam?.label)
    ) {
      setSelectedTeam(teamselect[0]);
      //stopLoading();
    }
  }, [pathname, selectedTeam?.label, teamselect]);

  const handleTeamSelect = React.useCallback(
    (team) => {
      //startLoading();
    //  console.log(team.value)
      setSelectedTeam(team);
      setOpen(false);
      const route = ROLE_ROUTES[team.label];
      if (route) {
        router.push(route);
        // stopLoading();
      } else {
        console.warn(`No route found for role: ${team.label}`);
        stopLoading();
      }
    },
    [router],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className="w-52 justify-between border-none"
        >
          <Building className="mr-2 size-4 text-[#007664]" />
          <span className="capitalize text-[#007664]">
            {selectedTeam ? selectedTeam.label : "Select a team"}
          </span>
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No teams found.</CommandEmpty>
            <CommandGroup heading="Teams">
              {teamselect.map((team) => (
                <CommandItem
                  key={team.value}
                  onSelect={() => handleTeamSelect(team)}
                  className=" text-sm capitalize text-[#007664]"
                >
                  {team.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
