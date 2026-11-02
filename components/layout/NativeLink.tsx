import type { ComponentPropsWithoutRef } from "react";

// Full document navigation keeps links reliable with the Vinext/Nitro runtime.
export default function NativeLink(props: ComponentPropsWithoutRef<"a">) {
  return <a {...props} />;
}
