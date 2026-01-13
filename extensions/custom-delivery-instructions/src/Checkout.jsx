import '@shopify/ui-extensions/preact';
import {render} from "preact";
import {useState} from "preact/hooks";

// [START custom-field.ext-index]
// 1. Export the extension
export default function() {
  render(<Extension />, document.body)
}
// [END custom-field.ext-index]

function Extension() {
  // [START custom-field.instruction-ui]
  const {
    applyMetafieldChange,
    appMetafields,
    i18n: {translate},
    target: {value: deliveryGroupList},
  } = shopify;
  const [checked, setChecked] = useState(false);
  // [END custom-field.instruction-ui]

  // [START custom-field.define-metafield]
  // Define the metafield namespace and key
  const metafieldNamespace = "yourAppNamespace"
  const metafieldKey = "deliveryInstructions";
  // [END custom-field.define-metafield]

  // [START custom-field.use-metafield]
  // Get a reference to the metafield
  const deliveryInstructions = appMetafields.value.find(
    (appMetafield) =>
      appMetafield.target.type === 'cart' &&
      appMetafield.metafield.namespace === metafieldNamespace &&
      appMetafield.metafield.key === metafieldKey,
  );
  // [END custom-field.use-metafield]

  // Guard against duplicate rendering of `shipping-option-list.render-after` target for one-time purchase and subscription sections. Calling `applyMetafieldsChange()` on the same namespace-key pair from duplicated extensions would otherwise cause an overwrite of the metafield value.
  // Instead of guarding, another approach would be to prefix the metafield key when calling `applyMetafieldsChange()`. The `deliveryGroupList`'s `groupType` could be used to such effect.'
  if (!deliveryGroupList || deliveryGroupList.groupType !== 'oneTimePurchase') {
    return null;
  }

  // [START custom-field.instruction-ui]
  // Render UI components
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
          // [START custom-field.update-metafield]
          onBlur={(event) => {
            // Apply the change to the cart metafield
            applyMetafieldChange({
              type: "updateCartMetafield",
              metafield: {
                namespace: metafieldNamespace,
                key: metafieldKey,
                type: "multi_line_text_field",
                value: event.target.value,
              }
            })
          }}
          // [END custom-field.update-metafield]
          value={`${deliveryInstructions?.metafield?.value || ''}`}
        />
      )}
    </s-stack>
  );
  // [END custom-field.instruction-ui]

  async function handleChange() {
    setChecked(!checked);
  }
}
