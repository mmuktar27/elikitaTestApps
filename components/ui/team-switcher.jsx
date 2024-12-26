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

export default function TeamSwitcher({ roles }) {
  const teamselect = (roles || [])
    .filter((role) => role !== "staff")
    .map((role) => ({ label: role, value: role }));

  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(() => {
    return teamselect.length > 0 ? teamselect[0] : null;
  });

  useEffect(() => {
    if (teamselect.length > 0 && !teamselect.includes(selectedTeam)) {
      setSelectedTeam(teamselect[0]);
    }
  }, [roles]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className="w-[200px] justify-between border-white bg-white text-[#007664] hover:bg-white/90 hover:text-[#007664]/90"
          >
            <Building className="mr-2 size-5" />
            {selectedTeam ? selectedTeam.label : "Select a team"}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] bg-white p-0 text-[#007664]">
          <Command>
            <CommandInput
              className="ring-0 focus:ring-0"
              placeholder="Search team..."
            />
            <CommandList>
              {teamselect.length > 0 ? (
                <CommandGroup>
                  {teamselect.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                      }}
                      className="text-sm hover:bg-[#007664] hover:text-white"
                    >
                      {team.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No teams found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
