import '@shopify/ui-extensions/preact';
import {useMetafield} from "@shopify/ui-extensions/checkout/preact";
import {render} from "preact";
import {useState} from "preact/hooks";

// 1. Export the extension
export default function() {
  render(<Extension />, document.body)
}

function Extension() {
  const {
    applyMetafieldChange,
    i18n: {translate},
    target: {value: deliveryGroupList},
  } = shopify;
  const [checked, setChecked] = useState(false);

  // Define the metafield namespace and key
  const metafieldNamespace = "yourAppNamespace"
  const metafieldKey = "deliveryInstructions";

  // Get a reference to the metafield
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });

  // Guard against duplicate rendering of `shipping-option-list.render-after` target for one-time purchase and subscription sections. Calling `applyMetafieldsChange()` on the same namespace-key pair from duplicated extensions would otherwise cause an overwrite of the metafield value.
  // Instead of guarding, another approach would be to prefix the metafield key when calling `applyMetafieldsChange()`. The `deliveryGroupList`'s `groupType` could be used to such effect.'
  if (!deliveryGroupList || deliveryGroupList.groupType !== 'oneTimePurchase') {
    return null;
  }

  // Get a reference to the metafield
  // 3. Render a UI
  return (
    <s-stack gap="base">
      <s-checkbox
        checked={checked}
        onChange={handleChange}
        label={translate('deliveryInstructionsCheckbox')}
      />
      {checked && (
        <s-text-area
          label={translate('deliveryInstructions')}
          rows={3}
          onBlur={(event) => {
            applyMetafieldChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metafieldKey,
              valueType: "string",
              value: event.target.value,
            })
          }}
          value={`${deliveryInstructions?.value || ''}`}
        />
      )}
    </s-stack>
  );

  async function handleChange() {
    setChecked(!checked);
  }
}
