import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AirlineFormProps } from "./AirlineForm";
import { Input } from "@/components/ui/input";
import { useFormContext, useWatch } from "react-hook-form";
import { capitalizeFirstLetter } from "@/helpers";

type DropDownProps = {
  location: "origin" | "destination";
};

const Dropdown = ({
  destinations,
  location,
}: AirlineFormProps & DropDownProps) => {
  const {
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const params = useSearchParams();
  const country = useWatch({ name: location });

  useEffect(() => {
    // Set values from URL params to apply history changes on UI
    setValue(
      location,
      destinations.find(
        (destination) => destination.code === params.get(location)
      )?.country
    );
    // clear errors when value exists
    if (params.get(location)) {
      clearErrors(location);
    }
  }, [params, location, destinations]);

  const handleDropdownChange = (value: string) => {
    const currentParams = new URLSearchParams(params.toString());
    currentParams.set(location, value);

    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div>
      <DropdownMenu>
        <div className="z-[10] relative select-none pointer-events-none left-2 -top-2">
          <span className="capitalize absolute px-1 bg-white rounded-full text-tiny font-display">
            {location}
          </span>
        </div>
        <DropdownMenuTrigger
          className="rounded-2xl w-56 hover:bg-white font-body py-6 px-11"
          asChild
        >
          <Input
            id={location}
            type="text"
            placeholder="Select a country"
            {...register(location, {
              required: `${capitalizeFirstLetter(
                location
              )} location is required`,
              validate: (value) => {
                const otherKeyword =
                  location === "origin" ? "destination" : "origin";
                const otherLocation = getValues(otherKeyword);

                if (value === otherLocation && location === "destination") {
                  return `${capitalizeFirstLetter(
                    location
                  )} cannot be same as Origin`;
                }
              },
            })}
            disabled
            className={`${
              errors[location] ? "border-red-500" : "border-primary"
            } text-center placeholder:select-none !cursor-pointer !opacity-100 outline-none`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="capitalize">
            {location}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={country}
            onValueChange={handleDropdownChange}
          >
            {destinations.map((destination) => (
              <DropdownMenuRadioItem
                key={destination.code}
                value={destination.code}
              >
                {destination.country}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {errors[location] && (
        <div className="relative mb-4">
          <span className="absolute px-1 text-red-500 rounded-full text-sm font-display">
            {typeof errors[location]?.message === "string"
              ? errors[location]?.message
              : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
