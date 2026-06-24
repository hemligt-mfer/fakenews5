import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plan } from "@/lib/types";
import Image from "next/image";
import SubButton from "./sub-button";
import { formatPrice } from "@/lib/format-price";

export default function SubCard({
  plan,
  loggedIn,
  userSubId,
  userSubPriceId,
}: {
  plan: Plan;
  loggedIn: boolean;
  userSubId: string | undefined;
  userSubPriceId: string | undefined;
}) {
  return (
    <div className="flex justify-center mb-5">
      <div
        className={
          plan.annualPrice == null ? "flex mx-auto" : "flex mx-auto gap-5"
        }
      >
        <Card className="flex md:w-xs bg-muted dark:bg-[#2d2d2d]">
          <CardHeader>
            <CardTitle className="capitalize">
              {plan.name} - {formatPrice(plan.price)} / month
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-row">
            <div className="mx-4">
              {plan.image ? (
                <Image
                  className="mx-auto"
                  src={plan.image}
                  alt={plan.name}
                  width={200}
                  height={200}
                />
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <span className="uppercase opacity-50 text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-5">
              <SubButton
                plan={plan.name}
                annual={false}
                disabled={!loggedIn || userSubPriceId === plan.priceId}
                userSubId={userSubId}
                label={
                  userSubPriceId === plan.priceId ? "Subscribed" : "Subscribe"
                }
              ></SubButton>
            </div>
          </CardContent>
          <CardFooter className="justify-center mt-auto">
            <p>{plan.description}</p>
          </CardFooter>
        </Card>
        {plan.annualPriceId && plan.annualPrice ? (
          <Card className="flex md:w-xs bg-muted dark:bg-[#2d2d2d]">
            <CardHeader>
              <CardTitle className="capitalize">
                {plan.name} - {formatPrice(plan.annualPrice)} / year
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="mx-4">
                {plan.image ? (
                  <Image
                    className="mx-auto"
                    src={plan.annualImage ? plan.annualImage : ""}
                    alt={plan.name}
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="flex w-full h-full items-center justify-center">
                    <span className="uppercase opacity-50 text-xs">
                      No image
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-5">
                <SubButton
                  plan={plan.name}
                  annual={true}
                  disabled={!loggedIn || userSubPriceId === plan.annualPriceId}
                  userSubId={userSubId}
                  label={
                    userSubPriceId === plan.annualPriceId
                      ? "Subscribed"
                      : "Subscribe"
                  }
                ></SubButton>
              </div>
            </CardContent>
            <CardFooter className="justify-center mt-auto">
              <p>
                Subscribe to our <span className="capitalize">{plan.name}</span>{" "}
                plan with a yearly subscription and{" "}
                <span className="text-green-700">
                  save {formatPrice(plan.price * 12 - plan.annualPrice)} / year!
                </span>
              </p>
            </CardFooter>
          </Card>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
