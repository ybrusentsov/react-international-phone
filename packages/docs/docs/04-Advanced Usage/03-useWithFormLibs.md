# Using with Form libraries

You can integrate form libraries like [**React Hook Form**](https://react-hook-form.com/) with the **PhoneInput** component to manage form state in a more structured and scalable way.

Below is an example using **react-hook-form** Controller component with basic validation using **google-libphonenumber**.

## React Hook Form Example

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="jsx" label="JavaScript">

```jsx
import { Controller, useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch {
    return false;
  }
};

function App() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = (data) => {
    //Here you can implement your on submit logic like an API POST request...
    alert(`Submitted Phone Number: ${data.phone}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="phone"
        control={control}
        rules={{
          required: 'Phone number is required',
          validate: (value) => isPhoneValid(value) || 'Phone number is invalid',
        }}
        render={({ field }) => (
          <div>
            <PhoneInput
              defaultCountry="us"
              value={field.value}
              onChange={field.onChange}
              inputClassName={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>
        )}
      />

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}

export default App;
```

  </TabItem>

  <TabItem value="tsx" label="TypeScript">

```tsx
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch {
    return false;
  }
};

interface IFormInput {
  phone: string;
}

function App() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    //Here you can implement your on submit logic like an API POST request...
    alert(`Submitted Phone Number: ${data.phone}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="phone"
        control={control}
        rules={{
          required: 'Phone number is required',
          validate: (value) => isPhoneValid(value) || 'Phone number is invalid',
        }}
        render={({ field }) => (
          <div>
            <PhoneInput
              defaultCountry="us"
              value={field.value}
              onChange={field.onChange}
              inputClassName={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>
        )}
      />

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}

export default App;
```

  </TabItem>

</Tabs>
