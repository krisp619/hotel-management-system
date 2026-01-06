# 🎨 Quick Reference: New Components

## Button Component

**File:** `src/components/Button.jsx`

### Basic Usage
```jsx
import { Button } from '../components/Button';

<Button>Click Me</Button>
```

### Props
```jsx
<Button
  variant="primary"        // 'primary' | 'secondary' | 'danger'
  loading={false}          // Show spinner
  disabled={false}         // Disable button
  fullWidth={false}        // 100% width
  type="button"            // HTML button type
  onClick={handleClick}    // Click handler
  className=""             // Additional CSS classes
>
  Button Text
</Button>
```

### Examples
```jsx
// Primary button with loading
<Button variant="primary" loading={isLoading}>
  Submit Form
</Button>

// Full-width secondary button
<Button variant="secondary" fullWidth>
  Cancel
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

---

## Input Component

**File:** `src/components/Input.jsx`

### Basic Usage
```jsx
import { Input } from '../components/Input';

const [email, setEmail] = useState('');
const [error, setError] = useState('');

<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
/>
```

### Props
```jsx
<Input
  label="Field Label"           // Display label
  type="text"                   // 'text' | 'email' | 'password' etc
  value=""                      // Current value
  onChange={handleChange}       // Change handler
  placeholder="Enter..."        // Placeholder text
  error=""                      // Error message
  required={false}              // Show required indicator
  disabled={false}              // Disable input
  autoComplete="off"            // Autocomplete attribute
/>
```

### Examples
```jsx
// Email input with validation
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>

// Password input
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Create a strong password"
  required
/>

// Text input with error
<Input
  label="Full Name"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error="Name is required"
/>
```

---

## Alert Component

**File:** `src/components/Alert.jsx`

### Basic Usage
```jsx
import { Alert } from '../components/Alert';

<Alert message="Success!" type="success" />
```

### Props
```jsx
<Alert
  message="Alert message"      // Alert text
  type="info"                  // 'success' | 'error' | 'warning' | 'info'
  icon="✓"                     // Icon character
  dismissible={true}           // Show close button
  onClose={handleClose}        // Close handler
/>
```

### Examples
```jsx
// Success alert
<Alert 
  message="Login successful!" 
  type="success"
  icon="✓"
/>

// Error alert with close button
<Alert
  message="Invalid credentials"
  type="error"
  dismissible
  onClose={() => setError('')}
/>

// Info alert
<Alert
  message="Password must be at least 6 characters"
  type="info"
/>

// Warning alert
<Alert
  message="This action cannot be undone"
  type="warning"
/>
```

### Alert Types

| Type | Color | Background | Icon |
|------|-------|-----------|------|
| success | Green | #d4edda | ✓ |
| error | Red | #f8d7da | ✕ |
| warning | Orange | #fff3cd | ⚠ |
| info | Blue | #d1ecf1 | ℹ |

---

## Card Component

**File:** `src/components/Card.jsx`

### Basic Usage
```jsx
import { Card } from '../components/Card';

<Card>
  {/* Your content */}
</Card>
```

### Props
```jsx
<Card
  title="Card Title"           // Optional title
  subtitle="Card subtitle"     // Optional subtitle
  className="custom-class"     // Additional classes
>
  {/* Card content */}
</Card>
```

### Examples
```jsx
// Simple card
<Card>
  <p>Just some content</p>
</Card>

// Card with title
<Card title="Profile">
  <form>
    {/* Form content */}
  </form>
</Card>

// Card with title and subtitle
<Card 
  title="Welcome Back"
  subtitle="Sign in to your account"
>
  <LoginForm />
</Card>

// Card with custom styling
<Card 
  title="Settings"
  className={styles.settingsCard}
>
  {/* Content */}
</Card>
```

---

## Complete Form Example

```jsx
import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';

export const MyForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    
    // Validate
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email required';
    if (!formData.password) newErrors.password = 'Password required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // API call here
      const response = await submitForm(formData);
      setSuccess('✓ Success!');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Login" subtitle="Sign in to your account">
      {success && <Alert message={success} type="success" />}
      {apiError && (
        <Alert 
          message={apiError} 
          type="error" 
          dismissible
          onClose={() => setApiError('')}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          required
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Card>
  );
};
```

---

## Style Customization

### Using CSS Modules
```jsx
import styles from './MyComponent.module.css';

<Button className={styles.customButton}>
  Click Me
</Button>
```

### CSS Module
```css
.customButton {
  margin-top: 2rem;
  font-size: 1.2rem;
}
```

### Override Styles
```css
/* In your CSS module */
:global(.primary):hover {
  background: #your-color;
}
```

---

## Accessibility Features

All components include:
- ✅ Proper label associations
- ✅ Keyboard navigation support
- ✅ Focus state styling
- ✅ Error message linking
- ✅ ARIA attributes (ready to add)
- ✅ Color contrast compliance

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Notes

- **CSS Modules** prevent style conflicts
- **Animations** optimized (0.3s default)
- **Spinners** use CSS animations (no JS)
- **No external dependencies** for components
- **Minimal bundle size impact**

---

## Troubleshooting

### Button not responding
- Check `disabled` prop
- Verify `onClick` handler

### Input not updating
- Ensure `onChange` handler is connected
- Check `value` prop binding

### Alert not showing
- Verify `message` prop is set
- Check conditional rendering

### Styles not applying
- Import CSS module correctly
- Check class name spelling
- Clear browser cache

---

## Common Patterns

### Form with Validation
```jsx
const [errors, setErrors] = useState({});

<Input
  error={errors.email}
  onChange={(e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors(prev => ({...prev, email: ''}));
  }}
/>
```

### Loading State
```jsx
const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={handleAsync}>
  Submit
</Button>
```

### Dismissible Alert
```jsx
const [alert, setAlert] = useState('');

<Alert 
  message={alert}
  onClose={() => setAlert('')}
  dismissible
/>
```

---

## Next Steps

1. Import components where needed
2. Follow the examples above
3. Customize colors if needed
4. Test on mobile devices
5. Check accessibility

---

**Last Updated:** January 6, 2026  
**Status:** ✅ Production Ready

For detailed documentation, see `UI_UX_IMPROVEMENTS.md`
