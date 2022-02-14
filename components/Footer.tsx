import {Text} from '@mantine/core'
import dayjs from 'dayjs'
import {FooterProps} from '~/types'

/**
 * Render the footer component.
 *
 * @param  {object}  props                The component attributes as props.
 * @param  {string}  props.updatedTime    The time the weather data was last updated.
 * @param  {string}  props.weatherStation The name of the weather station.
 * @return {Element}                      The footer component.
 */
export default function Footer({updatedTime, weatherStation}: FooterProps) {
  return (
    <footer>
      <Text align="center" size="sm" mt="lg">
        Last update:{' '}
        <strong>
          <time>{dayjs(updatedTime).format('MMMM D, YYYY @ H:mm')}</time>
        </strong>
      </Text>
      <Text align="center" size="sm" mb="lg">
        Data sourced from the{' '}
        <Text size="sm" variant="link" component="a" href="https://weather.gov">
          NWS
        </Text>{' '}
        station in {weatherStation}.
      </Text>
    </footer>
  )
}
