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
        <Card className="flex md:w-xs">
          <CardHeader>
            <CardTitle className="capitalize">
              {plan.name} - {plan.price / 100} per month
            </CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <div className="border mr-4">
              {plan.image ? (
                <Image
                  src={plan.image}
                  alt={plan.name}
                  width={50}
                  height={50}
                />
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <span className="uppercase opacity-50 text-xs">No image</span>
                </div>
              )}
            </div>
            <p>{plan.description}</p>
          </CardContent>
          <CardFooter className="justify-center mt-auto">
            <SubButton
              plan={plan.name}
              annual={false}
              disabled={!loggedIn || userSubPriceId === plan.priceId}
              userSubId={userSubId}
              label={
                userSubPriceId === plan.priceId ? "Subscribed" : "Subscribe"
              }
            ></SubButton>
          </CardFooter>
        </Card>
        {plan.annualPriceId && plan.annualPrice ? (
          <Card className="flex md:w-xs">
            <CardHeader>
              <CardTitle className="capitalize">
                {plan.name} - {plan.annualPrice / 100} per year
              </CardTitle>
            </CardHeader>
            <CardContent className="flex">
              <div className="border mr-4">
                {plan.image ? (
                  <Image src={plan.image} alt={plan.name} />
                ) : (
                  <div className="flex w-full h-full items-center justify-center">
                    <span className="uppercase opacity-50 text-xs">
                      No image
                    </span>
                  </div>
                )}
              </div>
              <p>
                Subscribe to our <span className="capitalize">{plan.name}</span>{" "}
                plan with a yearly subscription and{" "}
                <span className="text-green-700">
                  save {(plan.price * 12 - plan.annualPrice) / 100} per year!
                </span>
              </p>
            </CardContent>
            <CardFooter className="justify-center mt-auto">
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
            </CardFooter>
          </Card>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
