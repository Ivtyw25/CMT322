/**
 * Copy for the account group: Log in, Sign up, Forgot password and Account (profile).
 * Figma: login 4:959 / 133:36579, signup 78:2530 / 133:36671, forgot-password 100:4081 / 133:36768,
 * profile 92:2963 / 133:36817. Shared words (Cancel, Save, Show password) live in uiCopy.
 * Sign-in is simulated, so no copy claims a real email or Google call happened.
 */

const authShared = {
  brand: 'Mutiara Line',
  or: 'or',
  fields: {
    email: {
      label: 'Email address',
      placeholder: 'Enter your email',
    },
    password: {
      label: 'Password',
    },
  },
  guest: {
    action: 'Browse as a guest',
    body: 'Read project updates, the traffic map and FAQs. Log in to report an issue or track a ticket.',
  },
  legal: {
    prefix: 'By logging in you agree to our',
    and: 'and',
    terms: 'Terms & Conditions',
    privacy: 'Privacy policy.',
  },
  errors: {
    /** Shown above the form when the service cannot be reached. */
    network: "We couldn't reach the server. Check your connection and try again.",
    googleFailed: "Google sign-in didn't finish. Try again, or use your email and password.",
    googleCancelled: 'Google sign-in was cancelled. You can try again or use your email.',
  },
} as const;

export const accountCopy = {
  login: {
    meta: {
      title: 'Log in',
      description: 'Log in to report an issue and follow your tickets on the LRT Mutiara Line.',
    },
    header: {
      title: 'Welcome back',
      lede: 'Log in to report an issue and follow your tickets until they are resolved.',
    },
    panel: { heading: 'Your reports,\nall in one place' },
    brand: authShared.brand,
    google: { label: 'Sign in with Google' },
    or: authShared.or,
    fields: {
      email: authShared.fields.email,
      password: { label: authShared.fields.password.label, placeholder: 'Enter your password' },
      keepLoggedIn: 'Keep me logged in',
    },
    actions: {
      forgotPassword: 'Forgot password?',
      submit: 'Log in',
      submitting: 'Logging in…',
    },
    switchPrompt: { text: 'New here?', link: 'Create an account' },
    guest: authShared.guest,
    legal: authShared.legal,
    errors: {
      emailRequired: 'Enter your email address',
      emailInvalid: 'Enter an email address in the correct format, like name@example.com',
      passwordRequired: 'Enter your password',
      /** One message for both cases, so the form does not reveal which emails have accounts. */
      wrongCredentials:
        'The email or password is not right. Check both and try again, or reset your password.',
      noAccount:
        "We can't find an account for this email. Check the spelling, or create an account.",
      tooManyAttempts: 'Too many tries. Wait 5 minutes, or reset your password.',
      network: authShared.errors.network,
      googleFailed: authShared.errors.googleFailed,
      googleCancelled: authShared.errors.googleCancelled,
    },
    status: {
      success: 'Logged in. Taking you back.',
      alreadySignedIn: "You're already logged in as {name}.",
    },
    /** Shown when a page sent the visitor here, for example Report an issue. */
    redirectNotice: 'Log in to continue. You will return to the page you were on.',
  },

  signup: {
    meta: {
      title: 'Create an account',
      description:
        'Create an account to report an issue and track its progress on the LRT Mutiara Line.',
    },
    header: {
      title: 'Create your account',
      lede: 'You need an account to report an issue and track its progress.',
    },
    panel: { heading: 'Stay ahead of\nroad changes' },
    brand: authShared.brand,
    google: { label: 'Sign up with Google' },
    or: authShared.or,
    fields: {
      fullName: { label: 'Full name', placeholder: 'Enter your full name' },
      email: authShared.fields.email,
      password: { label: 'Password', placeholder: 'Create a password' },
    },
    passwordHint: 'At least 8 characters, with a number.',
    passwordRules: {
      label: 'Your password needs:',
      length: 'At least 8 characters',
      number: 'At least 1 number',
    },
    passwordStrength: {
      label: 'Password strength',
      weak: 'Weak',
      fair: 'Fair',
      strong: 'Strong',
    },
    actions: { submit: 'Create account', submitting: 'Creating your account…' },
    switchPrompt: { text: 'Already have an account?', link: 'Log in' },
    guest: authShared.guest,
    legal: {
      prefix: 'By creating an account you agree to our',
      and: 'and',
      terms: 'Terms & Conditions',
      privacy: 'Privacy policy.',
    },
    errors: {
      nameRequired: 'Enter your full name',
      nameTooLong: 'Use 80 characters or fewer for your name',
      emailRequired: 'Enter your email address',
      emailInvalid: 'Enter an email address in the correct format, like name@example.com',
      /** Offers the way forward instead of only blocking. */
      accountExists:
        'An account with this email already exists. Log in, or reset your password if you forgot it.',
      passwordRequired: 'Create a password',
      passwordTooShort: 'Use at least 8 characters in your password',
      passwordNoNumber: 'Add at least 1 number to your password',
      network: authShared.errors.network,
      googleFailed: authShared.errors.googleFailed,
      googleCancelled: authShared.errors.googleCancelled,
    },
    success: {
      title: 'Your account is ready',
      body: 'Welcome, {name}. You can now report an issue and track your tickets.',
      verifyNote: 'We sent a message to {email}. Open it to confirm your email address.',
      primary: 'Report an issue',
      secondary: 'Go to your account',
    },
  },

  forgotPassword: {
    meta: {
      title: 'Reset your password',
      description: 'Enter your email and we will send you a link to set a new password.',
    },
    header: {
      title: 'Reset your password',
      lede: 'Enter the email you use for Mutiara Line. We will send you a link to set a new password.',
    },
    panel: { heading: 'Back on track in a minute' },
    brand: authShared.brand,
    fields: { email: authShared.fields.email },
    actions: {
      submit: 'Send reset link',
      submitting: 'Sending…',
      resend: 'Send the link again',
    },
    switchPrompt: { text: 'Remembered it?', link: 'Back to log in' },
    note: 'The link expires after 30 minutes. Signed up with Google? Use Sign in with Google instead.',
    help: { text: 'Still stuck?', link: 'Contact us' },
    errors: {
      emailRequired: 'Enter your email address',
      emailInvalid: 'Enter an email address in the correct format, like name@example.com',
      network: authShared.errors.network,
      tooManyRequests:
        'You asked for a link a few minutes ago. Check your inbox and spam folder, or wait 2 minutes.',
    },
    /** Same message whether or not the email has an account, so the page does not reveal who has one. */
    checkEmail: {
      title: 'Check your email',
      body: 'If {email} has an account, we have sent a link to set a new password.',
      expiry: 'The link expires after 30 minutes.',
      noEmail: "Can't see it? Check your spam folder, or",
      resendIn: (seconds: number) => `You can send it again in ${seconds} seconds.`,
      back: 'Back to log in',
    },
  },

  account: {
    meta: {
      title: 'Your account',
      description: 'Manage your details, reports and followed stations.',
    },
    breadcrumb: 'Account',
    header: {
      memberSince: (date: string) => `Member since ${date}`,
      logOut: 'Log out',
    },
    nav: {
      label: 'Account',
      sectionBar: 'Account sections',
      items: {
        details: 'Profile details',
        reports: 'My reports',
        stations: 'My stations',
        security: 'Sign-in & security',
        privacy: 'Privacy & data',
      },
    },
    signedOut: {
      title: 'Log in to see your account',
      body: 'Your details, reports and followed stations show here once you log in.',
      login: 'Log in',
      signup: 'Create an account',
    },
    loading: 'Loading your account…',
    loadError: {
      title: "We couldn't load your account",
      body: 'Check your connection and try again.',
    },

    details: {
      title: 'Profile details',
      lede: 'Used by the team handling your reports when they need to contact you.',
      rows: {
        name: { label: 'Full name' },
        email: { label: 'Email', verified: 'Verified', unverified: 'Not verified' },
        phone: {
          label: 'Phone (optional)',
          hint: 'Only shared with the team handling your report.',
          empty: 'Not added',
          add: 'Add',
        },
        homeArea: { label: 'Home area', hint: 'Helps us show nearby closures first.' },
        language: { label: 'Language', hint: 'Bahasa Melayu is also available.' },
      },
      edit: {
        save: 'Save changes',
        cancel: 'Cancel',
        saved: 'Your details are saved.',
        fields: {
          name: 'Full name',
          email: 'Email address',
          phone: 'Phone number',
          homeArea: 'Home area',
          language: 'Language',
        },
        phoneHint: 'Include the country code, like +60 12-345 6789.',
        emailChangeNote:
          "We'll send a link to the new address. Your email stays the same until you open it.",
      },
      languages: {
        en: 'English',
        ms: 'Bahasa Melayu',
        msUnavailable: 'Bahasa Melayu is not available on this site yet. English stays on.',
      },
      errors: {
        nameRequired: 'Enter your full name',
        emailInvalid: 'Enter an email address in the correct format, like name@example.com',
        emailTaken: 'Another account already uses this email. Use a different address.',
        phoneInvalid: 'Enter a phone number in the format +60 12-345 6789',
        homeAreaRequired: 'Select your home area',
        saveFailed: "We couldn't save your changes. Check your connection and try again.",
      },
    },

    reports: {
      title: 'My reports',
      lede: 'Reports you have sent and where each one is up to.',
      viewAll: 'View all tickets',
      counts: { pending: 'Pending', inProgress: 'In progress', resolved: 'Resolved' },
      countsLabel: 'Your tickets by status',
      /** e.g. "MLC-261028-0482, updated 29 Oct 2026 at 10:12". */
      meta: (ticketId: string, date: string, time: string) =>
        `${ticketId}, updated ${date} at ${time}`,
      viewTicket: (title: string) => `View ticket: ${title}`,
      empty: {
        title: 'No reports yet',
        body: 'When you report an issue, its ticket shows here so you can follow it.',
        action: 'Report an issue',
      },
      error: "We couldn't load your reports. Try again in a moment.",
    },

    stations: {
      title: 'My stations',
      lede: 'We alert you about closures, night works and progress near these stations.',
      add: 'Add a station',
      remove: (name: string) => `Stop following ${name}`,
      removed: (name: string) => `You no longer follow ${name}.`,
      undo: 'Undo',
      added: (name: string) => `You now follow ${name}.`,
      picker: {
        title: 'Add a station',
        search: 'Search stations',
        searchPlaceholder: 'Search by station name or area',
        followed: 'Following',
        add: (name: string) => `Follow ${name}`,
        empty: 'No station matches your search. Check the spelling, or search by area.',
      },
      empty: {
        title: "You don't follow any stations",
        body: 'Follow a station to get alerts about closures and works near it.',
        action: 'Add a station',
      },
    },

    security: {
      title: 'Sign-in & security',
      lede: 'How you get into your account.',
      password: {
        label: 'Password',
        lastChanged: (when: string) => `Last changed ${when}`,
        change: 'Change',
        dialog: {
          title: 'Change your password',
          current: 'Current password',
          next: 'New password',
          confirm: 'Confirm new password',
          hint: 'At least 8 characters, with a number.',
          submit: 'Change password',
          success: 'Your password is changed. Other devices will ask you to log in again.',
        },
        errors: {
          currentWrong: 'Your current password is not right. Check it and try again.',
          tooShort: 'Use at least 8 characters in your new password',
          noNumber: 'Add at least 1 number to your new password',
          mismatch: 'The two passwords do not match. Enter the same password in both boxes.',
          sameAsOld: 'Choose a password you have not used on this account before.',
        },
      },
      google: {
        label: 'Google account',
        connected: 'Connected',
        notConnected: 'Not connected',
        disconnect: 'Disconnect',
        connect: 'Connect Google account',
        confirm: {
          title: 'Disconnect your Google account?',
          body: 'You will need your email and password to log in from now on.',
          confirm: 'Disconnect Google',
          keep: 'Keep connected',
        },
        disconnected: 'Google account disconnected.',
        noPasswordError: 'Set a password before you disconnect Google, or you would be locked out.',
      },
      devices: {
        label: 'Signed-in devices',
        current: (device: string) => `${device}, this device`,
        also: (device: string, when: string) => `Also signed in on ${device}, last active ${when}.`,
        logOutOthers: 'Log out of other devices',
        loggedOutOthers: 'Other devices are logged out.',
        none: 'No other devices are signed in.',
      },
    },

    privacy: {
      title: 'Privacy & data',
      lede: 'Your rights under the Personal Data Protection Act 2010.',
      download: {
        label: 'Your data',
        title: 'Download a copy',
        hint: 'Profile details and every report you have sent. Ready within 7 days.',
        request: 'Request',
        requested: (email: string) =>
          `We've got your request. We will email ${email} when your copy is ready.`,
        pending: 'Your copy is being prepared.',
      },
      terms: { label: 'Terms', value: 'Terms & Conditions', view: 'View' },
    },

    delete: {
      title: 'Delete account',
      body: 'Permanently remove your account and personal details. Open tickets will be closed, and this cannot be undone.',
      action: 'Delete account',
      confirm: {
        title: 'Delete your account?',
        body: 'We will remove your details and followed stations, and close your open tickets. This cannot be undone.',
        typeLabel: 'Type DELETE to confirm',
        typeMatch: 'DELETE',
        typeError: 'Type DELETE in capital letters to confirm',
        confirm: 'Delete my account',
        keep: 'Keep my account',
        working: 'Deleting your account…',
        failed: "We couldn't delete your account. Try again, or contact us for help.",
      },
      done: {
        title: 'Your account is deleted',
        body: 'Your details are removed. You can still read project updates as a guest.',
        action: 'Go to the home page',
      },
    },

    logOut: {
      done: "You're logged out.",
      confirm: {
        title: 'Log out?',
        body: 'You will need to log in again to report an issue or track a ticket.',
        confirm: 'Log out',
        cancel: 'Stay logged in',
      },
    },
  },
} as const;
